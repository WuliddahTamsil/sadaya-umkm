import {
  findManyAcrossDatabases,
  findOneAcrossDatabases,
  upsertAcrossDatabases,
  deleteAcrossDatabases
} from './mongoMultiDb.js';

const COLLECTION = 'orders';

function stripSourceDatabase(document) {
  if (!document) return document;
  const { _sourceDatabase, ...rest } = document;
  return rest;
}

function withUpdatedTimestamp(existingOrder, updates) {
  return {
    ...existingOrder,
    ...updates,
    updatedAt: new Date()
  };
}

export async function getAllOrders() {
  const orders = await findManyAcrossDatabases(COLLECTION, {}, {
    dedupeKeys: ['id', '_id']
  });
  return orders.map(stripSourceDatabase);
}

export async function getOrderById(id) {
  const order = await findOneAcrossDatabases(COLLECTION, { id }, {
    dedupeKeys: ['id', '_id']
  });
  return stripSourceDatabase(order);
}

export async function getOrdersByUserId(userId) {
  const orders = await findManyAcrossDatabases(COLLECTION, { userId }, {
    dedupeKeys: ['id', '_id']
  });
  return orders.map(stripSourceDatabase);
}

export async function getOrdersByUMKMId(umkmId) {
  const orders = await findManyAcrossDatabases(COLLECTION, { umkmId }, {
    dedupeKeys: ['id', '_id']
  });
  return orders.map(stripSourceDatabase);
}

export async function getOrdersByDriverId(driverId) {
  const orders = await findManyAcrossDatabases(COLLECTION, { driverId }, {
    dedupeKeys: ['id', '_id']
  });
  return orders.map(stripSourceDatabase);
}

export async function getOrdersByStatus(status) {
  const orders = await findManyAcrossDatabases(COLLECTION, { status }, {
    dedupeKeys: ['id', '_id']
  });
  return orders.map(stripSourceDatabase);
}

export async function saveOrder(newOrder) {
  await upsertAcrossDatabases(COLLECTION, { id: newOrder.id }, newOrder);
  return newOrder;
}

export async function updateOrder(id, updates) {
  const existingOrder = await getOrderById(id);
  if (!existingOrder) {
    throw new Error('Order tidak ditemukan');
  }

  const updatedOrder = withUpdatedTimestamp(existingOrder, updates);
  await upsertAcrossDatabases(COLLECTION, { id: existingOrder.id }, updatedOrder);
  return updatedOrder;
}

export async function deleteOrder(id) {
  const deletedCount = await deleteAcrossDatabases(COLLECTION, { id });
  return deletedCount > 0;
}
