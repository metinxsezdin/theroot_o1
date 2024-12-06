const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await db.Project.findAll();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'An error occurred while fetching projects' });
  }
});

// POST create a new project
router.post('/', async (req, res) => {
  try {
    const project = await db.Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'An error occurred while creating a project' });
  }
});

module.exports = router;
