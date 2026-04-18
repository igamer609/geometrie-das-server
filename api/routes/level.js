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

const reservedLevelRanges = [
    { start: 0, end: 127 },
    { start: 10000, end: 10999 }
]

const getNextAvailableLevelId = (startId) => {
    let nextId = startId
    let updated = true

    while (updated) {
        updated = false

        for (const range of reservedLevelRanges) {
            if (nextId >= range.start && nextId <= range.end) {
                nextId = range.end + 1
                updated = true
                break
            }
        }
    }

    return nextId
}

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

    // A little weird but should handle concurrency issues :3
    db.getConnection().then((connection) => {
        return connection.beginTransaction()
            .then(() => connection.query(
                "SELECT next_level_id FROM level_id_allocator WHERE id = 1 FOR UPDATE"
            ))
            .then(([[{ next_level_id }]]) => {
                const level_id = getNextAvailableLevelId(next_level_id)

                return connection.query(
                    "UPDATE level_id_allocator SET next_level_id = ? WHERE id = 1",
                    [level_id + 1]
                ).then(() => level_id)
            })
            .then((level_id) => {
                return connection.query("INSERT INTO levels SET ?", {
                    id: level_id,
                    title: req.body.title,
                    description: req.body.description,
                    author_name: author_name,
                    author_id: author_id,
                    song_id: req.body.song_id,
                    length: req.body.length,
                    version: req.body.version,
                    original_id: req.body.original_id || -1,
                    level_data: req.body.level_data
                }).then(() => level_id)
            })
            .then((level_id) => {
                return connection.commit().then(() => {
                    res.status(201).json({
                        "success": true,
                        "id": level_id
                    })
                })
            })
            .catch((err) => {
                return connection.rollback().then(() => {
                    throw err
                })
            })
            .finally(() => {
                connection.release()
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