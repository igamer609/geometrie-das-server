// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

const express = require("express")
const bcrypt = require("bcrypt")
const app = express()

const port = process.env.PORT;

const level = require("./routes/level.js")
const user = require("./routes/user.js")
const social = require("./routes/social.js")

bcrypt.genSalt

app.use(express.json())

app.use("/levels", level)
app.use("/social", social)
app.use("/users", user)

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).json({
        "success": false,
        "error": {
            "msg": err.message
        }
    })
})

app.get('/', (req, res) => {
    res.status(200).send(`<h1>Welcome to Geometrie Das!</h1><p>Running version 0.0.1a of the Geometrie Das API.</p>`)
});

app.listen(port, () => {
    console.log(`Geometrie Das Server API, up and running on port ${port}.`)
});

module.exports = app