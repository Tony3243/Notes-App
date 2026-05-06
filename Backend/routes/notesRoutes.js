import express from 'express'
import { authenticateToken } from '../middleware/auth.js'

export const notesRouter = express.Router();

notesRouter.get('/test', authenticateToken, (req, res) => {
    console.log('middleware hit'); // ← add this
    console.log('auth header:', req.headers['authorization'])
    res.json({ message: 'middleware works', user: req.users });
  });
