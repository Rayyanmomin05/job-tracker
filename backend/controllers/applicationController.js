const Application = require('../models/Application');
const Note = require('../models/Note');

// GET /applications
const getAllApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { company: { [Op.like]: `%${search}%` } },
        { role: { [Op.like]: `%${search}%` } },
      ];
    }

    const applications = await Application.findAll({
      where,
      include: [Note],
      order: [['createdAt', 'DESC']],
    });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /applications/:id
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [Note],
    });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /applications
const createApplication = async (req, res) => {
  try {
    const { company, role, location, salary, status, appliedDate, jobUrl, description } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: 'Company and role are required' });
    }

    const application = await Application.create({
      company,
      role,
      location,
      salary,
      status,
      appliedDate,
      jobUrl,
      description,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /applications/:id
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await application.update(req.body);
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /applications/:id
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    await application.destroy();
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /applications/:id/notes
const addNote = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const note = await Note.create({
      content: req.body.content,
      ApplicationId: req.params.id,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /applications/:id/notes/:noteId
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.noteId);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await note.destroy();
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /stats
const getStats = async (req, res) => {
  try {
    const total = await Application.count();
    const applied = await Application.count({ where: { status: 'Applied' } });
    const interviews = await Application.count({ where: { status: 'Interview' } });
    const offers = await Application.count({ where: { status: 'Offer' } });
    const rejected = await Application.count({ where: { status: 'Rejected' } });

    res.json({ total, applied, interviews, offers, rejected });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  addNote,
  deleteNote,
  getStats,
};