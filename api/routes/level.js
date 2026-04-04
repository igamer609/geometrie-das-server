// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

const express = require(express)
const db = require("../db/database")
const route = express.Router()

route.get("/", (req, res, next) => {

    const sql = "SELECT * FROM levels"
    const result = db.query(sql).then((query) => {
        res.send("Levels", query)
    }).catch((err) => {
        next(err)
    })
    
})

export default route