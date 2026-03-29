import {
  findManyAcrossDatabases,
  findOneAcrossDatabases,
  upsertAcrossDatabases,
  deleteAcrossDatabases
} from './mongoMultiDb.js';

const COLLECTION = 'contents';

function stripSourceDatabase(document) {
  if (!document) return document;
  const { _sourceDatabase, ...rest } = document;
  return rest;
}

export async function getAllContents() {
  const contents = await findManyAcrossDatabases(COLLECTION, {}, {
    dedupeKeys: ['id', '_id']
  });
  return contents.map(stripSourceDatabase);
}

export async function getPublishedContents() {
  const contents = await findManyAcrossDatabases(COLLECTION, { status: 'published' }, {
    dedupeKeys: ['id', '_id']
  });
  return contents.map(stripSourceDatabase);
}

export async function getContentById(id) {
  const content = await findOneAcrossDatabases(COLLECTION, { id }, {
    dedupeKeys: ['id', '_id']
  });
  return stripSourceDatabase(content);
}

export async function createContent(contentData) {
  const newContent = {
    id: `content-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    ...contentData,
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await upsertAcrossDatabases(COLLECTION, { id: newContent.id }, newContent);
  return newContent;
}

export async function updateContent(id, updates) {
  const existingContent = await getContentById(id);
  if (!existingContent) return null;

  const updatedContent = {
    ...existingContent,
    ...updates,
    updatedAt: new Date()
  };

  await upsertAcrossDatabases(COLLECTION, { id: existingContent.id }, updatedContent);
  return updatedContent;
}

export async function deleteContent(id) {
  const deletedCount = await deleteAcrossDatabases(COLLECTION, { id });
  return deletedCount > 0;
}

export async function incrementViews(id) {
  const content = await getContentById(id);
  if (!content) return null;

  const updatedContent = {
    ...content,
    views: (content.views || 0) + 1,
    updatedAt: new Date()
  };

  await upsertAcrossDatabases(COLLECTION, { id: content.id }, updatedContent);
  return updatedContent;
}

export async function incrementLikes(id) {
  const content = await getContentById(id);
  if (!content) return null;

  const updatedContent = {
    ...content,
    likes: (content.likes || 0) + 1,
    updatedAt: new Date()
  };

  await upsertAcrossDatabases(COLLECTION, { id: content.id }, updatedContent);
  return updatedContent;
}
