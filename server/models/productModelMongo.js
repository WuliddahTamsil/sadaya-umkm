import {
  findManyAcrossDatabases,
  findOneAcrossDatabases,
  upsertAcrossDatabases,
  deleteAcrossDatabases
} from './mongoMultiDb.js';

const COLLECTION = 'products';

function stripSourceDatabase(document) {
  if (!document) return document;
  const { _sourceDatabase, ...rest } = document;
  return rest;
}

export async function getAllProducts() {
  const products = await findManyAcrossDatabases(COLLECTION, {}, {
    dedupeKeys: ['id', '_id']
  });
  return products.map(stripSourceDatabase);
}

export async function getProductById(id) {
  const product = await findOneAcrossDatabases(COLLECTION, { id }, {
    dedupeKeys: ['id', '_id']
  });
  return stripSourceDatabase(product);
}

export async function getProductsByUMKM(umkmId) {
  const products = await findManyAcrossDatabases(COLLECTION, { umkmId }, {
    dedupeKeys: ['id', '_id']
  });
  return products.map(stripSourceDatabase);
}

export async function saveProduct(newProduct) {
  await upsertAcrossDatabases(COLLECTION, { id: newProduct.id }, newProduct);
  return newProduct;
}

export async function updateProduct(id, updates) {
  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    throw new Error('Produk tidak ditemukan');
  }

  const updatedProduct = {
    ...existingProduct,
    ...updates,
    updatedAt: new Date()
  };

  await upsertAcrossDatabases(COLLECTION, { id: existingProduct.id }, updatedProduct);
  return updatedProduct;
}

export async function deleteProduct(id) {
  const deletedCount = await deleteAcrossDatabases(COLLECTION, { id });
  return deletedCount > 0;
}
