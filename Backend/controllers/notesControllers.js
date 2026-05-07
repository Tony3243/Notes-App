import { supabase } from "../config/supabase.js";

export async function getNotes(req, res) {
    if(!req.user?.id) {//checks if req.user exist first before accessing id, if not return undefined
        console.log("User does not exist. Not able to get notes")
        return res.json({message: "User not found"})
    }
    const {data: fetchingNotes, error} = await supabase.from('notes').select("*").eq('user_id', req.user.id)//req.user.id comes from authcontrollers where we stored stored id in id
    if(error) {
        console.log('error:', error)
        return res.status(500).json({messageError: error})
    }
    console.log("worked!")
    res.json(fetchingNotes)
}

export async function addNote(req, res) {
    const {title, body} = req.body;

    if(!title || !body) {
        console.log("Missing field");
        return res.status(500).json({
            error: 'Missing field',   
            recieved: `${req.body}`
        })
    }
    const {data: addingNote, error} = await supabase.from('notes').insert({title, body, user_id: req.user.id}).select().single()
    if(error) {
        console.log("error: ", error);
        return res.status(500).json({message: 'Unable to add data'})
    }
    console.log(addingNote)
    res.status(201).json(addingNote)
}

export async function UpdateNote() {

}

export async function deleteNotes() {

}