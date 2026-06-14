const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const Task = require('./models/Task');
const DayPlan = require('./models/DayPlan');
const FocusSession = require('./models/FocusSession');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas ☁️🚀'))
    .catch(err => console.error('MongoDB connection error:', err));
// ==========================================
// TODO LIST ROUTES
// ==========================================
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a task by ID
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 1. Save a completed focus session
app.post('/api/focus', async (req, res) => {
    try {
        const newSession = new FocusSession({
            durationInMinutes: req.body.durationInMinutes || 25
        });
        await newSession.save();
        res.status(201).json({ message: "Session saved!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get all focus sessions (for the chart)
app.get('/api/focus', async (req, res) => {
    try {
        // Fetch all sessions, sorted by oldest to newest
        const sessions = await FocusSession.find().sort({ completedAt: 1 });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// DAILY PLANNER ROUTES
// ==========================================

// Get the daily plan
app.get('/api/dayplan', async (req, res) => {
    try {
        let plan = await DayPlan.findOne();
        if (!plan) {
            plan = await DayPlan.create({ planData: {} });
        }
        res.json(plan.planData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update the daily plan
app.post('/api/dayplan', async (req, res) => {
    try {
        let plan = await DayPlan.findOne();
        if (!plan) {
            plan = new DayPlan();
        }
        plan.planData = req.body;
        await plan.save();
        res.json({ message: 'Day plan updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT||5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));