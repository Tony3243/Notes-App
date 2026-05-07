import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { supabase } from '../config/supabase.js'

//this function handles new users registration
export async function register(req, res) {
    const {name, email, password_hash} = req.body;//access user input for name, email, and password

    const {data: existingUser} = await supabase.from('users').select('id').eq('email', email).single();//gets list of id that are in the db

    if(existingUser) {//checks if id exist; is so the user already exist
        console.log("User already exist in our database");
        return res.status(409).json({message: "Email already in use."})
    }
    const newHashedPassword = await bcrypt.hash(password_hash, 10);//create a hashed password
    //new users save their data in the users db including their hashed password
    const{data, error} = await supabase.from('users').insert([{name, email, password_hash: newHashedPassword}]).select().single()
    console.log('Welcome user!')
    console.log('data:', data);
    console.log('error:', error);
    res.json(data)
}

export async function login(req, res) {
    const {name, email, password_hash} = req.body;//access user input for destructured columns
    
    const {data: nonexistentUser, error} = await supabase.from('users').select('id, name, email, password_hash').eq('email', email).single(); //selects columns based on if email exist in db
    //no need to hash passsword again since already in db
    const comparing = await bcrypt.compare(password_hash, nonexistentUser.password_hash)//compare the stored hash password with user input password
    if(!comparing) {
        console.error("Passwords do not match")
        return res.status(500).json({message: "Passwords do not match"})
    }
    //check if email doens;t exist
    if(!nonexistentUser.email) {
        console.log("Email was not found")
        return res.status(500).json({message: "Email invalid. Try again"})
    }
    //once loged in, created a payload of an id and email for the jwt token along wih the and a the JWT_secret token type
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

    