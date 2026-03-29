import { MongoClient } from 'mongodb';

let clientPromise = null;

function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MongoDB URI');
  }
  return mongoUri;
}

function parseDbNameFromUri(mongoUri) {
  try {
    const parsed = new URL(mongoUri);
    const dbName = parsed.pathname.replace(/^\/+/, '').trim();
    return dbName || 'test';
  } catch {
    return 'test';
  }
}

export function getPrimaryDbName() {
  return parseDbNameFromUri(getMongoUri());
}

export function getSecondaryDbNames() {
  const primaryDb = getPrimaryDbName();
  const configured = (process.env.MONGODB_SECONDARY_DBS || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  const defaults = ['sadaya', 'test'];
  const dbNames = configured.length > 0 ? configured : defaults;

  return [...new Set(dbNames.filter((name) => name !== primaryDb))];
}

export function getAllDbNames() {
  return [getPrimaryDbName(), ...getSecondaryDbNames()];
}

async function getClient() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(getMongoUri(), {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000
    });
  }
  return clientPromise;
}

export async function getDb(dbName) {
  const client = await getClient();
  return client.db(dbName);
}

function normalizeValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim().toLowerCase();
  return String(value).trim().toLowerCase();
}

function toComparableDocument(document) {
  if (!document) return document;
  if (document._id && typeof document._id !== 'string') {
    return {
      ...document,
      _id: document._id.toString()
    };
  }
  return document;
}

function createDocumentKey(document, dedupeKeys = ['id', 'email', '_id']) {
  for (const key of dedupeKeys) {
    const normalized = normalizeValue(document?.[key]);
    if (normalized) {
      return `${key}:${normalized}`;
    }
  }
  return null;
}

export function mergeDocuments(documents, dedupeKeys = ['id', 'email', '_id']) {
  const seen = new Set();
  const merged = [];

  for (const rawDocument of documents) {
    const document = toComparableDocument(rawDocument);
    const documentKey = createDocumentKey(document, dedupeKeys);

    if (documentKey && seen.has(documentKey)) {
      continue;
    }

    if (documentKey) {
      seen.add(documentKey);
    }

    merged.push(document);
  }

  return merged;
}

export async function findManyAcrossDatabases(collectionName, query = {}, options = {}) {
  const { sort, dedupeKeys } = options;
  const documents = [];

  for (const dbName of getAllDbNames()) {
    const db = await getDb(dbName);
    const collection = db.collection(collectionName);
    const rows = await collection.find(query).toArray();

    for (const row of rows) {
      documents.push({
        ...row,
        _sourceDatabase: dbName
      });
    }
  }

  const merged = mergeDocuments(documents, dedupeKeys);

  if (typeof sort === 'function') {
    merged.sort(sort);
  }

  return merged;
}

export async function findOneAcrossDatabases(collectionName, query = {}, options = {}) {
  const { sort, dedupeKeys } = options;
  const documents = await findManyAcrossDatabases(collectionName, query, { sort, dedupeKeys });
  return documents[0] || null;
}

export async function upsertAcrossDatabases(collectionName, identityFilter, nextDocument) {
  let savedDocument = null;

  for (const dbName of getAllDbNames()) {
    const db = await getDb(dbName);
    const collection = db.collection(collectionName);

    await collection.updateOne(
      identityFilter,
      {
        $set: nextDocument,
        $setOnInsert: {
          createdAt: nextDocument.createdAt || new Date()
        }
      },
      { upsert: true }
    );

    if (!savedDocument && dbName === getPrimaryDbName()) {
      savedDocument = await collection.findOne(identityFilter);
    }
  }

  return toComparableDocument(savedDocument);
}

export async function updateAcrossDatabases(collectionName, identityFilter, updateDocument) {
  let updatedDocument = null;

  for (const dbName of getAllDbNames()) {
    const db = await getDb(dbName);
    const collection = db.collection(collectionName);
    const existingDocument = await collection.findOne(identityFilter);

    if (!existingDocument) {
      continue;
    }

    await collection.updateOne(identityFilter, { $set: updateDocument });

    if (!updatedDocument) {
      updatedDocument = await collection.findOne(identityFilter);
    }
  }

  return toComparableDocument(updatedDocument);
}

export async function incrementAcrossDatabases(collectionName, identityFilter, increments = {}, extraSets = {}) {
  let updatedDocument = null;

  for (const dbName of getAllDbNames()) {
    const db = await getDb(dbName);
    const collection = db.collection(collectionName);
    const existingDocument = await collection.findOne(identityFilter);

    if (!existingDocument) {
      continue;
    }

    await collection.updateOne(identityFilter, {
      $inc: increments,
      $set: extraSets
    });

    if (!updatedDocument) {
      updatedDocument = await collection.findOne(identityFilter);
    }
  }

  return toComparableDocument(updatedDocument);
}

export async function deleteAcrossDatabases(collectionName, identityFilter) {
  let deletedCount = 0;

  for (const dbName of getAllDbNames()) {
    const db = await getDb(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.deleteMany(identityFilter);
    deletedCount += result.deletedCount || 0;
  }

  return deletedCount;
}
