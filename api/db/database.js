import * as mysql from "mysql2"

console.log(process.env)

const db = await mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: "geometrie_das",
    connectionLimit: 20,
}).promise()

await db.getConnection().then((res) => {
    console.log("Connected to MySQL!")
}).catch((err) => {
    console.error("Failed to connect to MySQL.")
    throw err
})

export default db