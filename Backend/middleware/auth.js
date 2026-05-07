//auth checks that run before controllers; checks tokens validility

import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
    const header = req.headers['authorization']; // authorization header comes as a string

    if(!header) {
        console.log("Header is invalid")
        return res.status(403).json({Header_error: "Header is invalid"})
    }
    const bearer = header.split(" ");//turn header in an array --> [bearer, token*]
    const token = bearer[1];

    //uses .verify() to authenticate the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {//token is already an object
        if(err) {
            console.log("Error: Verification has failed.") 
            return res.status(403).json({message: "Invalid token"})
        }
        req.user = user
        next()//goes to the next middlware or function
    })
}
