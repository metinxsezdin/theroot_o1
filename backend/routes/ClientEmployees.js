const express = require('express');
const router = express.Router();
const db = require('../models');

// GET all client employees
router.get('/', async (req, res) => {
  try {
    const employees = await db.ClientEmployee.findAll();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'An error occurred while fetching employees' });
  }
});

// GET a single client employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await db.ClientEmployee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    res.status(500).json({ message: 'An error occurred while fetching the employee' });
  }
});

// POST create a new client employee
router.post('/', async (req, res) => {
  try {
    const { name, role, email, phone, department, clientId } = req.body;
    const newEmployee = await db.ClientEmployee.create({
      name,
      role,
      email,
      phone,
      department,
      clientId,
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'An error occurred while creating the employee' });
  }
});

// PUT update a client employee
router.put('/:id', async (req, res) => {
  try {
    const { name, role, email, phone, department } = req.body;
    const employee = await db.ClientEmployee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await employee.update({ name, role, email, phone, department });
    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'An error occurred while updating the employee' });
  }
});

// DELETE a client employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await db.ClientEmployee.findByPk(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await employee.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'An error occurred while deleting the employee' });
  }
});

module.exports = router;
