// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

const express = require("express")
const db = require("../db/database")
const route = express.Router()
const { parseToken } = require("../utils/token")
const { requirePermissionLevel } = require("../utils/requirePermissionLevel")
const { commentCheck, ratingCheck } = require("../db/validSchemas")
const { body, param, validationResult } = require("express-validator")

route.get("/", (req, res) => {
    res.send("Social")
})

route.post("/rate/:level_id", [ratingCheck, parseToken] ,(req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){

        console.log(errors.array())

        return res.status(400).json({
            "success": false,
            "errors": errors.array(),
        })
    }

    const level_id = parseInt(req.params.level_id)

    db.query("INSERT INTO level_ratings SET ?", {level_id: level_id, user_id: req.user_id, rating: req.body.rating})
    .then(([rows, fields]) => {
        res.status(200).json({
            "success": true,
        })
    }).catch((err) => {
        next(err)
    })
})

route.post("/comment", [commentCheck, parseToken], (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            "success": false,
            "errors": errors.array(),
        })
    }

    const level_id = req.body.level_id
    const content = req.body.content
    const scope = req.body.scope

    db.query("INSERT INTO comments SET ?", {
        level_id: level_id, content: content, scope: scope, 
        user_id: req.user_id, user_name: req.username
    }).then(([row, fields]) => {
        res.status(201).json({
            "success": true,
            "comment_id": row.insertId
        })
    }).catch((err) => {
        next(err)
    })

})



module.exports = route