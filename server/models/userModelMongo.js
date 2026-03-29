import {
  findManyAcrossDatabases,
  findOneAcrossDatabases,
  upsertAcrossDatabases,
  deleteAcrossDatabases
} from './mongoMultiDb.js';

const COLLECTION = 'users';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripSourceDatabase(document) {
  if (!document) return document;
  const { _sourceDatabase, ...rest } = document;
  return rest;
}

function buildUpdatedUser(existingUser, updates) {
  const cleanUpdates = {};

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      cleanUpdates[key] = value;
    }
  }

  cleanUpdates.updatedAt = new Date();

  return {
    ...existingUser,
    ...cleanUpdates
  };
}

export async function getAllUsers() {
  const users = await findManyAcrossDatabases(COLLECTION, {}, {
    dedupeKeys: ['email', 'id', '_id']
  });
  return users.map(stripSourceDatabase);
}

export async function getUserById(id) {
  if (!id) return null;

  const normalizedId = id.toString().trim();
  const user = await findOneAcrossDatabases(COLLECTION, {
    id: { $regex: `^${escapeRegex(normalizedId)}$`, $options: 'i' }
  }, {
    dedupeKeys: ['email', 'id', '_id']
  });

  return stripSourceDatabase(user);
}

export async function getUserByEmail(email) {
  const normalizedEmail = email?.toLowerCase().trim();
  if (!normalizedEmail) return null;

  const user = await findOneAcrossDatabases(COLLECTION, {
    email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: 'i' }
  }, {
    dedupeKeys: ['email', 'id', '_id']
  });

  return stripSourceDatabase(user);
}

export async function saveUser(newUser) {
  await upsertAcrossDatabases(COLLECTION, { id: newUser.id }, newUser);
  return newUser;
}

export async function updateUser(id, updates) {
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error(`User dengan ID ${id} tidak ditemukan`);
  }

  const updatedUser = buildUpdatedUser(existingUser, updates);
  await upsertAcrossDatabases(COLLECTION, { id: existingUser.id }, updatedUser);
  return updatedUser;
}

export async function deleteUser(id) {
  const deletedCount = await deleteAcrossDatabases(COLLECTION, { id });
  return deletedCount > 0;
}
