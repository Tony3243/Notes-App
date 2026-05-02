//ENTRY POINTOF THE APP**
import express from "express"//Node.js web framework that create API routes
import nodeman from 'nodeman'
import 'dotenv/config'
import { supabase } from "./config/supabase.js";

const app = express();

const PORT = 8000;

app.use(express.json()) //parsing JSON Request


//http://localhost:8000
app.get('/', async (req, res) => {
    try {
        const {data, error} = await supabase.from('users').select('name');
        if(error) {
            console.log(error);
            return res.status(500).json({error: error.message})
        }
        res.json({
            message: "Data is retrieved",
            notes: data
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({error: err})
    }
})

app.listen(PORT, () => {console.log(`Listening on port ${PORT}`)})
.on('error', (err) => {console.error(err)})
// console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
// console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY)