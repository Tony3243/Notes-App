import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import { getNotes, addNote, updateNote, deleteNotes } from '../controllers/notesControllers.js';

export const notesRouter = express.Router();

//each route is protected by a verification middlware since http is stateless, every request is brand new when traveling between paths
notesRouter.get('/allNotes', authenticateToken, getNotes)
notesRouter.post('/addNote', authenticateToken, addNote)
notesRouter.patch('/:id', authenticateToken, updateNote)
notesRouter.delete('/:id', authenticateToken, deleteNotes)

