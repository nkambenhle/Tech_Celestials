const express = require('express');
const router = express.Router();
const Module = require('../models/module');

// GET all modules
router.get('/', async (req, res) => {
    try {
        const modules = await Module.find();
        res.json(modules);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET module by ID
router.get('/:id', async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (module) res.json(module);
        else res.status(404).json({ message: 'Module not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new module
router.post('/', async (req, res) => {
    const module = new Module(req.body);
    try {
        const newModule = await module.save();
        res.status(201).json(newModule);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH update a module
router.patch('/:id', async (req, res) => {
    try {
        const module = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (module) res.json(module);
        else res.status(404).json({ message: 'Module not found' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a module
router.delete('/:id', async (req, res) => {
    try {
        const result = await Module.findByIdAndDelete(req.params.id);
        if (result) res.json({ message: 'Module deleted' });
        else res.status(404).json({ message: 'Module not found' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

