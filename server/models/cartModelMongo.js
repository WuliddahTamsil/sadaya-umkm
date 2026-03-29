import {
  findManyAcrossDatabases,
  findOneAcrossDatabases,
  upsertAcrossDatabases,
  deleteAcrossDatabases
} from './mongoMultiDb.js';

const COLLECTION = 'carts';

function stripSourceDatabase(document) {
  if (!document) return document;
  const { _sourceDatabase, ...rest } = document;
  return rest;
}

export async function getCartByUserId(userId) {
  const items = await findManyAcrossDatabases(COLLECTION, { id_user: userId }, {
    dedupeKeys: ['id', '_id']
  });
  return items.map(stripSourceDatabase);
}

export async function getCartItemById(id) {
  const item = await findOneAcrossDatabases(COLLECTION, { id }, {
    dedupeKeys: ['id', '_id']
  });
  return stripSourceDatabase(item);
}

export async function saveCartItem(newItem) {
  await upsertAcrossDatabases(COLLECTION, { id: newItem.id }, newItem);
  return newItem;
}

export async function updateCartItem(id, updates) {
  const existingItem = await getCartItemById(id);
  if (!existingItem) {
    throw new Error('Cart item tidak ditemukan');
  }

  const updatedItem = {
    ...existingItem,
    ...updates,
    updatedAt: new Date()
  };

  await upsertAcrossDatabases(COLLECTION, { id: existingItem.id }, updatedItem);
  return updatedItem;
}

export async function deleteCartItem(id) {
  const deletedCount = await deleteAcrossDatabases(COLLECTION, { id });
  return deletedCount > 0;
}

export async function deleteCartByUserId(userId) {
  return await deleteAcrossDatabases(COLLECTION, { id_user: userId });
}

export async function addToCart(userId, productId, quantity, currentPrice) {
  const existingItem = await findOneAcrossDatabases(COLLECTION, {
    id_user: userId,
    id_produk: productId
  }, {
    dedupeKeys: ['id', '_id']
  });

  if (existingItem) {
    const updatedItem = {
      ...stripSourceDatabase(existingItem),
      jumlah: (existingItem.jumlah || 0) + quantity,
      harga_saat_ini: currentPrice,
      updatedAt: new Date()
    };

    await upsertAcrossDatabases(COLLECTION, { id: existingItem.id }, updatedItem);
    return updatedItem;
  }

  const newItem = {
    id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    id_user: userId,
    id_produk: productId,
    jumlah: quantity,
    harga_saat_ini: currentPrice,
    tanggal_ditambahkan: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await upsertAcrossDatabases(COLLECTION, { id: newItem.id }, newItem);
  return newItem;
}
