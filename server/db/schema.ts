import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }),
});

export const bands = pgTable('bands', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  name: varchar('name', { length: 255 }),
  bio: varchar('bio', { length: 1000 }),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bandId: integer('band_id').references(() => bands.id),
  venueId: integer('venue_id'),
  date: timestamp('date'),
});
