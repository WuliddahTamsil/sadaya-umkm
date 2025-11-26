import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const useMongoDB = !!process.env.MONGODB_URI;

let mongoCommentModelPromise = null;
async function getMongoModel() {
  if (!useMongoDB) return null;
  if (!mongoCommentModelPromise) {
    mongoCommentModelPromise = import('./commentModelMongo.js').then(module => {
      console.log('✅ Using MongoDB for comment storage');
      return module;
    }).catch(error => {
      console.warn('⚠️ MongoDB import failed, falling back to JSON file:', error.message);
      return null;
    });
  }
  return await mongoCommentModelPromise;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COMMENT_FILE = `${__dirname}/../data/comments.json`;

const ensureDataDir = async () => {
  const dataDir = `${__dirname}/../data`;
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
};

export const getCommentsByContentId = async (contentId) => {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getCommentsByContentId(contentId);
  }
  try {
    await ensureDataDir();
    if (!existsSync(COMMENT_FILE)) {
      return [];
    }
    const data = await readFile(COMMENT_FILE, 'utf-8');
    const comments = JSON.parse(data);
    return comments.filter(comment => comment.contentId === contentId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error reading comments:', error);
    return [];
  }
};

export const createComment = async (commentData) => {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.createComment(commentData);
  }
  await ensureDataDir();
  const comments = await getCommentsByContentId(commentData.contentId);
  
  const newComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...commentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  let allComments = [];
  if (existsSync(COMMENT_FILE)) {
    const data = await readFile(COMMENT_FILE, 'utf-8');
    allComments = JSON.parse(data);
  }
  
  allComments.push(newComment);
  await writeFile(COMMENT_FILE, JSON.stringify(allComments, null, 2), 'utf-8');
  
  // Update content comments count
  await updateCommentCount(commentData.contentId);
  
  return newComment;
};

export const deleteComment = async (id) => {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.deleteComment(id);
  }
  await ensureDataDir();
  if (!existsSync(COMMENT_FILE)) {
    return false;
  }
  const data = await readFile(COMMENT_FILE, 'utf-8');
  const comments = JSON.parse(data);
  const comment = comments.find(c => c.id === id);
  if (!comment) return false;
  
  const filtered = comments.filter(c => c.id !== id);
  await writeFile(COMMENT_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  
  // Update content comments count
  await updateCommentCount(comment.contentId);
  
  return true;
};

export const updateCommentCount = async (contentId) => {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.updateCommentCount(contentId);
  }
  // For JSON fallback, update content file
  try {
    const contentFile = `${__dirname}/../data/contents.json`;
    if (existsSync(contentFile)) {
      const data = await readFile(contentFile, 'utf-8');
      const contents = JSON.parse(data);
      const contentIndex = contents.findIndex(c => c.id === contentId);
      if (contentIndex !== -1) {
        const commentList = await getCommentsByContentId(contentId);
        contents[contentIndex].comments = commentList ? commentList.length : 0;
        await writeFile(contentFile, JSON.stringify(contents, null, 2), 'utf-8');
      }
    }
  } catch (error) {
    console.error('Error updating comment count:', error);
  }
};

