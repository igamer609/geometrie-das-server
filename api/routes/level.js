// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

const express = require("express")
const db = require("../db/database")
const route = express.Router()
const { parseToken } = require("../utils/token")
const { levelUploadCheck } = require("../db/validSchemas")
const { validationResult } = require("express-validator")

route.get("/", (req, res, next) => {

    const sql = "SELECT * FROM levels"
    const result = db.query(sql).then((query) => {
        res.send("Levels", query)
    }).catch((err) => {
        next(err)
    })
    
})

route.post("/", [levelUploadCheck ,parseToken], (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            "success": false,
            "errors": errors.array()
        })
    }

    const author_name = req.username
    const author_id = req.user_id

    db.query("INSERT INTO levels SET ?", {
        title: req.body.title,
        description: req.body.description,
        author_name: author_name,
        author_id: author_id,
        song_id: req.body.song_id,
        length: req.body.length,
        version: req.body.version,
        original_id: req.body.original_id || -1,
        level_data: req.body.level_data
    }).then(([rows, fields]) => {
        res.status(201).json({
            "success": true,
            "id": rows[0].insertId
        })
    }).catch((err) => {
        next(err)
    })

})

module.exports = route