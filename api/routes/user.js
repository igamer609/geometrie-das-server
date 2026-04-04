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
const { userSignUpCheck } = require("../db/validSchemas")

const route = express.Router()

route.post("/auth", userSignUpCheck ,(req, res, next) => {
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({
            "success": false,
            "errors": errors.array(),
        })
    }

    const username = req.body.username
    const password = req.body.password
    bcrypt.hash(password, 10).then((hash) => {
        db.query()
    })

})

export default route