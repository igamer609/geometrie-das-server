// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

const jwt = require("jsonwebtoken")

function createToken(name, id, permission_level = 0){
    
    const payload = {
        name: name,
        permission_level: permission_level,
        id: id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
    return token

}

function parseToken(req, res, next) {

    const authHeader = req.headers["authentication"]
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){

        return res.status(401).json({
            "success": false,
            "error": {"msg": "No or malformed token provided."}
        })

    }

    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => { 

            if(error){
                next(err)
            }

            req.username = decoded.name
            req.user_id = decoded.id

            if(decoded.permission_level){
                req.permission_level = decoded.permission_level
            }

            next()

        })
    } catch (error) {

        return res.status(403).json({
            "success": false,
            "error": {"msg": "Token is invalid. Authenticate again."}
        })

    }
}

module.exports = { createToken, parseToken }