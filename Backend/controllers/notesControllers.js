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
    //inserting the id is what connects the notes to the user. Without it, would result in null
    const {data: addingNote, error} = await supabase.from('notes').insert({title, body, user_id: req.user.id}).select().single()
    if(error) {
        console.log("error: ", error);
        return res.status(500).json({message: 'Unable to add data'})
    }
    console.log(addingNote)
    res.status(201).json(addingNote)
}

export async function updateNote(req, res) {
    const {title, body} = req.body;
    const {id} = req.params//accesses the specific notes id for editing

    //updating and returning notes based on the specific notes id & see if user_id matches the id in the token
    const {data: updatingNote, error} = await supabase.from('notes').update({title, body}).eq('id', id).eq('user_id', req.user.id).select();
    if(error) {
        console.log('update error:', error);
        return res.status(500).json({message: "Updating error"})
    }
    res.status(201).json(updatingNote)
}

export async function deleteNotes(req, res) {
    console.log(req.user)
    const {id} = req.params;

    const {data: deletingNote, error} = await supabase.from('notes').delete().eq('id', id).eq('user_id', req.user.id).select();
    if(error) {
        console.log('Delete error:', error);
        return res.status(500).json({deleteMessage: error})
    }
    res.status(201).json(deletingNote)
}