const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all clients
router.get('/', async (req, res) => {
  try {
    const clients = await db.Client.findAll();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'An error occurred while fetching clients' });
  }
});

// GET a single client by ID
router.get('/:id', async (req, res) => {
  try {
    const client = await db.Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    res.status(500).json({ message: 'An error occurred while fetching the client' });
  }
});

// POST create a new client
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newClient = await db.Client.create({ name, email, phone });
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'An error occurred while creating the client' });
  }
});

// PUT update a client
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const client = await db.Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    await client.update({ name, email, phone });
    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'An error occurred while updating the client' });
  }
});

// DELETE a client
router.delete('/:id', async (req, res) => {
  try {
    const client = await db.Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    await client.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'An error occurred while deleting the client' });
  }
});

module.exports = router;
