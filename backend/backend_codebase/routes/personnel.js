const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all personnel
router.get('/', async (req, res) => {
  try {
    const personnel = await db.Personnel.findAll({
      attributes: ['id', 'name', 'role', 'email', 'availability'], // availability dahil
    });
    res.json(personnel);
  } catch (error) {
    console.error('Error fetching personnel:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// GET a single personnel by ID
router.get('/:id', async (req, res) => {
  try {
    const person = await db.Personnel.findByPk(req.params.id, {
      attributes: ['id', 'name', 'role', 'email', 'availability'],
    });
    if (!person) {
      return res.status(404).json({ message: 'Personnel not found' });
    }
    res.json(person);
  } catch (error) {
    console.error('Error fetching personnel by ID:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// POST create a new personnel
router.post('/', async (req, res) => {
  try {
    const { name, role, email, availability } = req.body;
    const newPerson = await db.Personnel.create({ name, role, email, availability });
    res.status(201).json(newPerson);
  } catch (error) {
    console.error('Error creating personnel:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// PUT update a personnel
router.put('/:id', async (req, res) => {
  try {
    const { name, role, email, availability } = req.body;
    const person = await db.Personnel.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Personnel not found' });
    }
    await person.update({ name, role, email, availability });
    res.json(person);
  } catch (error) {
    console.error('Error updating personnel:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// DELETE a personnel
router.delete('/:id', async (req, res) => {
  try {
    const person = await db.Personnel.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Personnel not found' });
    }
    await person.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting personnel:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
