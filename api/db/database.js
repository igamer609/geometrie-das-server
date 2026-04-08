// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

const mysql = require("mysql2")

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
    connectionLimit: 20,
}).promise()

db.getConnection().then((res) => {
    console.log("Connected to MySQL!")
}).catch((err) => {
    console.error("Failed to connect to MySQL.")
    throw err
})

module.exports = db