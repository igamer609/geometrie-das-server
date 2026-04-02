const express = require("express")
const app = express()

const port = process.env.PORT

app.get('/', (req, res) => {
    res.status(200).send(`Welcome to Geometrie Das!`)
})

app.listen(port, () => {
    console.log(`Geometrie Das Server API, up and running on port ${port}.`)
})