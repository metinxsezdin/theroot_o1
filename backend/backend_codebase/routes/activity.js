
const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all activities
router.get('/', async (req, res) => {
  try {
    const activities = await db.Activity.findAll();
    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// POST create an activity
router.post('/', async (req, res) => {
  try {
    const activity = await db.Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
