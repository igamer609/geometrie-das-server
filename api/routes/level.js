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
const { body, validationResult } = require("express-validator")

route.get("/",
    body("page").isInt({ min: 0 }),
    body("page_size").isInt({ min: 1, max: 25 }),
    (req, res, next) => {

    const sql = `SELECT id,original_id,title,author_id,author_name,song_id,length,downloads,likes,avg_rating,feature_level
            FROM levels`
    const result = db.query(sql).then((query) => {
        res.send("Levels", query)
    }).catch((err) => {
        next(err)
    })

})

route.get("/:level_id", (req, res, next) => {
    const level_id = parseInt(req.params.level_id)

    db.query("SELECT * FROM levels WHERE id = ?", [level_id]).then(([rows, fields]) => {

        if (rows.length == 0) {
            return res.status(404).json({
                "success": false,
                "message": "Level not found."
            })
        }

        db.query("UPDATE levels SET downloads = downloads + 1 WHERE id = ?", [level_id]).catch((err) => {
            next(err)
        })

        res.status(200).json({
            "success": true,
            "level": rows[0]
        })

    }).catch((err) => {
        next(err)
    })
})

route.post("/", [levelUploadCheck, parseToken], (req, res, next) => {
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
    }).then(([row, fields]) => {
        res.status(201).json({
            "success": true,
            "id": row.insertId
        })
    }).catch((err) => {
        next(err)
    })

})

route.put("/:id", [levelUploadCheck, parseToken], (req, res, next) => {

    const level_id = req.params.id
    const user_id = req.user_id

    const errors = validationResult(req)

    if (!errors.isEmpty()) {

        return res.status(400).json({
            "success": false,
            "errors": errors.array()
        })

    }

    db.query("UPDATE levels SET ? WHERE id = ? AND author_id = ?", [{
        title: req.body.title,
        description: req.body.description,
        song_id: req.body.song_id,
        length: req.body.length,
        version: req.body.version,
        original_id: req.body.original_id || -1,
        level_data: req.body.level_data,
        level_version: level_version + 1,
    }, level_id, user_id]).then(([rows, fields]) => {

        if (rows.affectedRows == 0) {
            return res.status(404).json({
                "success": false,
                "message": "Level not found or no sufficient authorization to modify level."
            })
        }

        res.status(200).json({
            "success": true
        })

    }).catch((err) => {
        next(err)
    })

})

route.delete("/:id", parseToken, (req, res, next) => {
    const level_id = parseInt(req.params.id)
    const user_id = req.user_id

    db.query("DELETE FROM levels WHERE id = ? AND author_id = ?", [level_id, user_id]).then(([rows, fields]) => {

        if (rows.length == 0) {
            return res.status(404).json({
                "success": false,
                "message": "Level not found or no sufficient authorization to modify level."
            })
        }

        res.status(200).json({
            "success": true
        })

    }).catch((err) => {
        next(err)
    })
})

module.exports = route