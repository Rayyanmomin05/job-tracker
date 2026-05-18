const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  addNote,
  deleteNote,
  getStats,
} = require('../controllers/applicationController');

router.get('/stats', getStats);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);
router.post('/:id/notes', addNote);
router.delete('/:id/notes/:noteId', deleteNote);

module.exports = router;