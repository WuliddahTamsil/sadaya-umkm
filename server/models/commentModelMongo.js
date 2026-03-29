import {
  findManyAcrossDatabases,
  findOneAcrossDatabases,
  upsertAcrossDatabases,
  deleteAcrossDatabases,
  updateAcrossDatabases
} from './mongoMultiDb.js';

const COLLECTION = 'comments';
const CONTENT_COLLECTION = 'contents';

function stripSourceDatabase(document) {
  if (!document) return document;
  const { _sourceDatabase, ...rest } = document;
  return rest;
}

export async function getCommentsByContentId(contentId) {
  const comments = await findManyAcrossDatabases(COLLECTION, { contentId }, {
    dedupeKeys: ['id', '_id'],
    sort: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  });
  return comments.map(stripSourceDatabase);
}

export async function createComment(commentData) {
  const newComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    ...commentData,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await upsertAcrossDatabases(COLLECTION, { id: newComment.id }, newComment);
  await updateCommentCount(commentData.contentId);
  return newComment;
}

export async function deleteComment(id) {
  const comment = await findOneAcrossDatabases(COLLECTION, { id }, {
    dedupeKeys: ['id', '_id']
  });

  if (!comment) {
    return false;
  }

  await deleteAcrossDatabases(COLLECTION, { id });
  await updateCommentCount(comment.contentId);
  return true;
}

export async function updateCommentCount(contentId) {
  const comments = await getCommentsByContentId(contentId);
  const content = await findOneAcrossDatabases(CONTENT_COLLECTION, { id: contentId }, {
    dedupeKeys: ['id', '_id']
  });

  if (!content) {
    return comments.length;
  }

  await updateAcrossDatabases(CONTENT_COLLECTION, { id: contentId }, {
    comments: comments.length,
    updatedAt: new Date()
  });

  return comments.length;
}
