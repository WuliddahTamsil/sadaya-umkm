import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Jika MONGODB_URI ada, gunakan MongoDB, jika tidak gunakan file JSON
const useMongoDB = !!process.env.MONGODB_URI;

// Lazy load MongoDB model
let mongoUserModelPromise = null;
async function getMongoModel() {
  if (!useMongoDB) return null;

  if (!mongoUserModelPromise) {
    mongoUserModelPromise = import('./userModelMongo.js')
      .then((module) => {
        console.log('Using MongoDB for user storage');
        return module;
      })
      .catch((error) => {
        console.warn('MongoDB import failed, falling back to JSON file:', error.message);
        return null;
      });
  }
  return await mongoUserModelPromise;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE = join(__dirname, '../data/users.json');

// Helper function untuk membaca data dari file
async function readUsers() {
  try {
    console.log('Reading users.json from:', DATA_FILE);
    const data = await readFile(DATA_FILE, 'utf-8');
    console.log('File read successfully, length:', data.length);

    if (!data || data.trim() === '') {
      console.warn('File users.json kosong, mengembalikan array kosong');
      return [];
    }

    console.log('Parsing JSON...');
    const parsed = JSON.parse(data);
    console.log('JSON parsed successfully, type:', typeof parsed);

    // Pastikan hasilnya adalah array
    if (!Array.isArray(parsed)) {
      console.error('File users.json tidak berisi array, type:', typeof parsed);
      return [];
    }

    console.log('Users array length:', parsed.length);
    return parsed;
  } catch (error) {
    console.error('Error in readUsers:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    // Jika file tidak ada, return array kosong
    if (error.code === 'ENOENT') {
      console.warn('File users.json tidak ditemukan di:', DATA_FILE);
      return [];
    }
    // Jika error parsing JSON
    if (error instanceof SyntaxError) {
      console.error('Error parsing users.json:', error.message);
      console.error('File path:', DATA_FILE);
      throw new Error(`Error parsing users.json: ${error.message}`);
    }
    throw error;
  }
}

// Helper function untuk menulis data ke file
async function writeUsers(users) {
  try {
    await writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
    console.log('Users berhasil disimpan ke:', DATA_FILE);
  } catch (error) {
    console.error('Error writing users.json:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);

    // Di Vercel, file system adalah read-only
    if (error.code === 'EROFS' || error.code === 'EACCES') {
      throw new Error('File system is read-only. Cannot write to file. Please use a database for production (MongoDB, PostgreSQL, etc.)');
    }
    throw error;
  }
}

// Get all users
export async function getAllUsers() {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getAllUsers();
  }
  return await readUsers();
}

// Get user by ID (case-insensitive, whitespace trimmed)
export async function getUserById(id) {
  if (!id) return null;

  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.getUserById(id);
  }

  const users = await readUsers();
  // Normalize ID untuk perbandingan (trim whitespace dan case-insensitive)
  const normalizedId = id.toString().trim();

  // Coba exact match dulu
  let user = users.find((userItem) => userItem.id === normalizedId);

  // Jika tidak ditemukan, coba case-insensitive match
  if (!user) {
    user = users.find((userItem) => {
      const userId = userItem.id?.toString().trim();
      return userId?.toLowerCase() === normalizedId.toLowerCase();
    });
  }

  return user || null;
}

// Get user by email (case-insensitive)
export async function getUserByEmail(email) {
  try {
    const mongoModel = await getMongoModel();
    if (mongoModel) {
      try {
        return await mongoModel.getUserByEmail(email);
      } catch (mongoError) {
        console.warn('MongoDB getUserByEmail failed, falling back to JSON file:', mongoError.message);
        // Fallback to JSON file if MongoDB fails
        const users = await readUsers();
        return users.find((user) => user.email === email);
      }
    }
  } catch (error) {
    console.warn('MongoDB model import failed, using JSON file:', error.message);
  }
  const users = await readUsers();
  // Email comparison should be case-insensitive
  const normalizedEmail = email?.toLowerCase().trim();
  return users.find((user) => user.email?.toLowerCase().trim() === normalizedEmail);
}

// Save new user
export async function saveUser(newUser) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.saveUser(newUser);
  }
  const users = await readUsers();
  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

// Update user
export async function updateUser(id, updates) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.updateUser(id, updates);
  }
  const users = await readUsers();
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    throw new Error('User tidak ditemukan');
  }

  users[index] = { ...users[index], ...updates };
  await writeUsers(users);
  return users[index];
}

// Delete user
export async function deleteUser(id) {
  const mongoModel = await getMongoModel();
  if (mongoModel) {
    return await mongoModel.deleteUser(id);
  }
  const users = await readUsers();
  const filteredUsers = users.filter((user) => user.id !== id);
  await writeUsers(filteredUsers);
  return true;
}
