import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { supabase } from '../config/supabase.js'


export async function register(req, res) {
    const {name, email, password_hash} = req.body;

    const {data: existingUser} = await supabase.from('users').select('id').eq('email', email).single();//gets the list of existing users emails

    if(existingUser) {
        console.log("User already exist in our database");
        return res.status(409).json({message: "Email already in use."})
    }
    const newHashedPassword = await bcrypt.hash(password_hash, 10);
    const{data, error} = await supabase.from('users').insert([{name, email, password_hash: newHashedPassword}]).select().single()
    console.log('Welcome user!')
    console.log('data:', data);
    console.log('error:', error);
    res.json(data)
}

export async function login(req, res) {
    const {name, email, password_hash} = req.body;
    
    const {data: nonexistentUser, error} = await supabase.from('users').select('id, name, email, password_hash').eq('email', email).single(); //selects email form users database
    //no need to hash passsword again since already in db
    const comparing = await bcrypt.compare(password_hash, nonexistentUser.password_hash)//compare the stored hash password with user input password
    if(!comparing) {
        console.error("Passwords do not match")
        return res.status(500).json({message: "Passwords do not match"})
    }

    if(!nonexistentUser.email) {
        console.log("Email was not found")
        return res.status(500).json({message: "Email invalid. Try again"})
    }
    jwt.sign({id: nonexistentUser.id, email: nonexistentUser.email}, process.env.JWT_SECRET, {expiresIn: "1h"}, (err, token) => {
        if(err) {
            console.log("Error sign-up")
            return res.status(403).json({message: "Error sign_up"})
        } else {
            console.log(`Welcome back ${name}. Token is ${token}`);
            return res.json(token)
        }
    })
}

    