// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

import express from "express"
const route = express.Router()

route.get("/", (req, res) => {
    res.send("Social")
})

export default route