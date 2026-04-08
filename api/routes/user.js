// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

const express = require("express")
const db = require("../db/database")
const bcrypt = require("bcrypt")
const { createToken, parseToken } = require("../utils/token")
const { validationResult } = require("express-validator")
const { userRegisterCheck } = require("../db/validSchemas")

const route = express.Router()

route.get("/auth/signup", (req, res, next) => {
    res.status(200).sendFile("/api/web/signup.html")
})

route.post("/auth/signup", userRegisterCheck , (req, res, next) => {
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            "success": false,
            "errors": errors.array(),
        })
    }

    const username = req.body.username
    const password = req.body.password

    const hashed = bcrypt.hash(password, 10).then((hash) => {
        
        db.query('INSERT INTO users SET ?', {name: username, pass: hash}).then(([row, fields]) => {

            const token = createToken(username, row.insertId)
            
            res.status(201).json({
                "success": true,
                "id": row.insertId,
                "token": token
            })

        }).catch((err) => {

            if(err.code == "ER_DUP_ENTRY"){
                return res.status(409).send("Username is already taken. Please use another one.")
            }

            next(err)
        })

    }).catch((err) => {
        next(err)
    })

})

route.post("/auth/signin", userRegisterCheck, (req, res, next) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            "success": false,
            "errors": errors.array(),
        })
    }

    const username = req.body.username
    const password = req.body.password

    db.query("SELECT id, pass FROM users WHERE name = ?", [username]).then(([rows, fields]) => {

        if(rows.length == 0){
            return res.status(404).send("No account with that username was found.")
        }

        bcrypt.compare(password, rows[0].pass).then((matches) => {

            if(matches){
                const token = createToken(username, rows[0].id)
            
                res.status(201).json({
                    "success": true,
                    "id": rows[0].id,
                    "token": token
                })

            }
        }).catch((err)=>{ 
            next(err) 
        })

    }).catch((err) => {
        next(err)
    })
    
})

route.get("/", parseToken, (req, res, next) => {

    try{
        res.status(200).json({
            "id": req.user_id
        })
    } catch(err){
        next(err)
    }

})

module.exports = route