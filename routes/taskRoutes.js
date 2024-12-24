const express = require('express');
const Task = require('../models/Task');
const Opportunity = require("../models/Opportunity");
const Client = require("../models/Client");
const Property = require("../models/propertyModel");
const Lead = require("../models/Lead");


const router = express.Router();

// Create a new task
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, startDate, endDate, assignedTo } = req.body;
    const task = new Task({ title, description, startDate, endDate, assignedTo });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get tasks for a specific date range (calendar view)
router.get('/tasks/calendar', async (req, res) => {
  const { startDate, endDate } = req.query; // Assuming query params are sent
  try {
    const tasks = await Task.find({
      startDate: { $gte: new Date(startDate) },
      endDate: { $lte: new Date(endDate) },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task status
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get count 
router.get('/count', async (req, res) => {
  try {
    const leadCount = await Lead.countDocuments();
    const opportunityCount = await Opportunity.countDocuments();
    const clientCount = await Client.countDocuments();
    const propertyCount = await Property.countDocuments();
    
    const count = { 
      Lead: leadCount, 
      Opportunity: opportunityCount, 
      Client: clientCount, 
      Property: propertyCount 
    }; 

    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
