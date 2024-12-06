const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await db.Booking.findAll();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// POST create a booking
router.post('/', async (req, res) => {
  try {
    const booking = await db.Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
