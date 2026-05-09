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
    
    const {data: nonexistentUser} = await supabase.from('users').select('id, name, email, password_hash').eq('email', email).single(); //selects columns based on if email exist in db
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
    //the token user start off with before it exxpires
    const accessToken = jwt.sign({id: nonexistentUser.id, email: nonexistentUser.email}, process.env.JWT_SECRET, {expiresIn: "1h"})
    //token anly exist within a hypothetical callback for .sign(), eithout callback is synchrenous and immedialty return the token and lives within the variable
    const refreshToken = jwt.sign({id: nonexistentUser.id, email: nonexistentUser.email}, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"})
    await supabase.from('refresh_token').insert([{token: refreshToken, user_id: nonexistentUser.id}]).select()
    res.json({accessToken, refreshToken})
}

export async function refresh(req, res) {
    //access refreshToken
    const {token} = req.body;
    console.log(req.body.token)
    //console.log(refreshToken)
    if(!token) {
        console.log("Refresh Token doesn't exist")
        return res.status(404).json({message: "Refresh token doesn not exist"})
    }

    //select all the columns from refres_token if token matches with the refreshed token
    const {data: refreshing} = await supabase.from('refresh_token').select('*').eq('token', token).single();
    if(!refreshing) {
        console.log("Tokens don't match")
        return res.status(500).json({message: "Tokens don't match"})
    }

    //checks if refresh token is valid
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if(err) {
            console.log("Error for refresh token verification")
            return res.status(403).json({message: 'Invalid refresh token'})
        }
       //if valid, create a new accessToken
       const accessToken = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '15m'})
       return res.json({accessToken})
    })
}

//logout consist of deleting the refreshtoken from database, hence user has one more 15 min cycle
export async function logout(req, res) {
    const header = req.headers['authorization']
    const token = header.split(" ")[1]
    const {data: logoff} = await supabase.from('refresh_token').delete().eq('token', token).select()

    if(!logoff) {
        console.log("Can't find the token")
        return res.status(404).json({message: "Can't log off"})
    }
    console.log("User logged out and refresh token is deleted?")
    res.json({message: 'User logged off'})
}

    