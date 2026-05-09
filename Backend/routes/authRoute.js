import express from 'express'
import {register, login, refresh, logout} from '../controllers/authcontrollers.js'

export const authRouter = express.Router()

authRouter.post('/login', login)
authRouter.post('/refresh', refresh)
authRouter.post('/register', register)
authRouter.delete('/logout', logout)