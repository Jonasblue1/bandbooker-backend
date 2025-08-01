import { pgTable, serial, varchar, foreignKey, integer, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }),
	email: varchar("email", { length: 255 }),
});

export const bands = pgTable("bands", {
	id: serial("id").primaryKey().notNull(),
	userId: integer("user_id").references(() => users.id),
	name: varchar("name", { length: 255 }),
	bio: varchar("bio", { length: 1000 }),
});

export const bookings = pgTable("bookings", {
	id: serial("id").primaryKey().notNull(),
	bandId: integer("band_id").references(() => bands.id),
	venueId: integer("venue_id"),
	date: timestamp("date", { mode: 'string' }),
});