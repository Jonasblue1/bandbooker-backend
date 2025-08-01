import express from 'express';
import { db } from '../db/client';
import { bookings } from '../db/schema';
import { eq } from 'drizzle-orm';

export const bookingsRouter = express.Router();

// Get all bookings
bookingsRouter.get('/', async (req, res) => {
  try {
    const allBookings = await db.select().from(bookings);
    res.json(allBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get a single booking
bookingsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const booking = await db.select().from(bookings).where(eq(bookings.id, id));
    if (!booking.length) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching booking' });
  }
});

// Create a booking
bookingsRouter.post('/', async (req, res) => {
  const { bandId, venueId, eventDate, notes } = req.body;
  try {
    const result = await db.insert(bookings).values({ bandId, venueId, eventDate, notes }).returning();
    res.status(201).json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update a booking
bookingsRouter.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { bandId, venueId, eventDate, notes } = req.body;
  try {
    const result = await db
      .update(bookings)
      .set({ bandId, venueId, eventDate, notes })
      .where(eq(bookings.id, id))
      .returning();
    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Delete a booking
bookingsRouter.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.delete(bookings).where(eq(bookings.id, id));
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});
