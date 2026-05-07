//ENTRY POINTOF THE APP**
import express from "express"//Node.js web framework that create API routes
import 'dotenv/config'
import { authRouter } from './routes/authRoute.js'//route path to my auth
import { notesRouter } from "./routes/notesRoutes.js";

const app = express();

const PORT = 8000;

app.use(express.json()) //parsing JSON Request

//http://localhost:8000/api/auth
app.use('/api/auth', authRouter)

//http://localhost:8000/api/notes
app.use('/api/notes', notesRouter)
app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)})
.on('error', (err) => {console.error(err)})