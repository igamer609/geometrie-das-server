// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

import express from 'express'
const app = express()

const port = process.env.PORT;

import level from "./routes/level.js"
import user from "./routes/user.js"
import social from "./routes/social.js"

app.get('/', (req, res) => {
    res.status(200).send("<h1>Welcome to Geometrie Das!</h1><p>Running version 0.0.1a of the Geometrie Das API.</p>")
});

app.listen(port, () => {
    console.log(`Geometrie Das Server API, up and running on port ${port}.`)
});

app.use("/level", level)
app.use("/social", social)
app.use("/user", user)

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send("Internal server error.")
})
