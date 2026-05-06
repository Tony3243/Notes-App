//auth checks that run before controllers

import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
    const header = req.headers['authorization']; // authorization header comes as a string

    if(!header) {
        console.log("Header is invalid")
        return res.status(403).json({Header_error: "Header is invalid"})
    }
    const bearer = header.split(" ");//turn header in an array --> [bearer, 8408909r]
    const token = bearer[1];

    req.token = token;

    jwt.verify({token: req.token}, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            console.log("Error: Verification has failed.") 
            return res.status(403)

        }
        res.json({Successful_decoding: decoded })
    })
    next()
}
