import { supabase} from './config/notesControllers.js'

export async function getNote(req, res) {
    console.log(req.user.userId)
    try {
        const getNotes = await supabase.from('notes').select('*').eq('user_id', req.user.userId)
    } catch (err) {

    }
}
    