import express from 'express';
import { db } from '../db/client';
import { venues } from '../db/schema';
import { eq } from 'drizzle-orm';

export const venuesRouter = express.Router();

// Get all venues
venuesRouter.get('/', async (_req, res) => {
  try {
    const allVenues = await db.select().from(venues);
    res.json(allVenues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

// Get a single venue
venuesRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const venue = await db.select().from(venues).where(eq(venues.id, id));
    if (!venue.length) return res.status(404).json({ error: 'Venue not found' });
    res.json(venue[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching venue' });
  }
});

// Create a venue
venuesRouter.post('/', async (req, res) => {
  const { name, location } = req.body;
  try {
    const result = await db.insert(venues).values({ name, location }).returning();
    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create venue' });
  }
});

// Update a venue
venuesRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, location } = req.body;
  try {
    await db.update(venues).set({ name, location }).where(eq(venues.id, id));
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update venue' });
  }
});

// Delete a venue
venuesRouter.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.delete(venues).where(eq(venues.id, id));
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete venue' });
  }
});
