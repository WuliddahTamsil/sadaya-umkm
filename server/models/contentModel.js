import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CONTENT_FILE = `${__dirname}/../data/contents.json`;

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = `${__dirname}/../data`;
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
};

// Read all contents
export const getAllContents = async () => {
  try {
    await ensureDataDir();
    if (!existsSync(CONTENT_FILE)) {
      return [];
    }
    const data = await readFile(CONTENT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contents:', error);
    return [];
  }
};

// Get published contents only
export const getPublishedContents = async () => {
  const contents = await getAllContents();
  return contents.filter(content => content.status === 'published');
};

// Get content by ID
export const getContentById = async (id) => {
  const contents = await getAllContents();
  return contents.find(content => content.id === id);
};

// Create new content
export const createContent = async (contentData) => {
  await ensureDataDir();
  const contents = await getAllContents();
  
  const newContent = {
    id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...contentData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    likes: 0,
    comments: 0
  };
  
  contents.push(newContent);
  await writeFile(CONTENT_FILE, JSON.stringify(contents, null, 2), 'utf-8');
  return newContent;
};

// Update content
export const updateContent = async (id, updates) => {
  await ensureDataDir();
  const contents = await getAllContents();
  const index = contents.findIndex(content => content.id === id);
  
  if (index === -1) {
    return null;
  }
  
  contents[index] = {
    ...contents[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  await writeFile(CONTENT_FILE, JSON.stringify(contents, null, 2), 'utf-8');
  return contents[index];
};

// Delete content
export const deleteContent = async (id) => {
  await ensureDataDir();
  const contents = await getAllContents();
  const filtered = contents.filter(content => content.id !== id);
  
  await writeFile(CONTENT_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
};

// Increment views
export const incrementViews = async (id) => {
  const content = await getContentById(id);
  if (!content) return null;
  
  return await updateContent(id, {
    views: (content.views || 0) + 1
  });
};

