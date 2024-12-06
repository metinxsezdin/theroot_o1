
const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all departments
router.get('/', async (req, res) => {
  try {
    const departments = await db.Department.findAll();
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// POST create a department
router.post('/', async (req, res) => {
  try {
    const department = await db.Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
