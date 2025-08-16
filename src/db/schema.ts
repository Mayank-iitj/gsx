import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar'),
  role: text('role').notNull().default('user'),
  status: text('status').notNull().default('active'),
  lastSeen: text('last_seen'),
  joinDate: text('join_date').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  stock: integer('stock').notNull().default(0),
  status: text('status').notNull().default('active'),
  rating: real('rating').default(0),
  image: text('image'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customerName: text('customer_name').notNull(),
  amount: real('amount').notNull(),
  status: text('status').notNull().default('pending'),
  date: text('date').notNull(),
  itemsCount: integer('items_count').notNull().default(1),
  paymentMethod: text('payment_method').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const activityLogs = sqliteTable('activity_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  description: text('description').notNull(),
  timestamp: text('timestamp').notNull(),
  createdAt: text('created_at').notNull(),
});

export const componentInteractions = sqliteTable('component_interactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  componentType: text('component_type').notNull(),
  interactionType: text('interaction_type').notNull(),
  data: text('data', { mode: 'json' }),
  timestamp: text('timestamp').notNull(),
  createdAt: text('created_at').notNull(),
});