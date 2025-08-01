import express from 'express';
import { db } from '../db/client';
import { bands } from '../db/schema';
import { eq } from 'drizzle-orm';

export const bandsRouter = express.Router();

// Get all bands
bandsRouter.get('/', async (_req, res) => {
  try {
    const allBands = await db.select().from(bands);
    res.json(allBands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bands' });
  }
});

// Get a single band
bandsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const band = await db.select().from(bands).where(eq(bands.id, id));
    if (!band.length) return res.status(404).json({ error: 'Band not found' });
    res.json(band[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching band' });
  }
});

// Create a band
bandsRouter.post('/', async (req, res) => {
  const { name, genre } = req.body;
  try {
    const result = await db.insert(bands).values({ name, genre }).returning();
    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create band' });
  }
});

// Update a band
bandsRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, genre } = req.body;
  try {
    await db.update(bands).set({ name, genre }).where(eq(bands.id, id));
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update band' });
  }
});

// Delete a band
bandsRouter.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.delete(bands).where(eq(bands.id, id));
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete band' });
  }
});
