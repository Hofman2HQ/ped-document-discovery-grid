
const express = require('express');
const router = express.Router();
const pedSearchSessionController = require('../controllers/pedSearchSessionController');

// GET all search sessions
router.get('/', pedSearchSessionController.getAllSearchSessions);

// GET search session by ID
router.get('/:id', pedSearchSessionController.getSearchSessionById);

// POST create new search session
router.post('/', pedSearchSessionController.createSearchSession);

// PUT update search session
router.put('/:id', pedSearchSessionController.updateSearchSession);

// DELETE search session
router.delete('/:id', pedSearchSessionController.deleteSearchSession);

module.exports = router;
