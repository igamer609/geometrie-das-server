const jwt = require("jsonwebtoken")

function createToken(name, id){
    const secret_key = process.env.JWT_SECRET_KEY

    const payload = {
        name: name,
        id: id
    }

    const token = jwt.sign(payload, secret_key, )
}

function parseToken(token) {
    const secret_key = process.env.JWT_SECRET_KEY

    try {
        const verified = jwt.verify(token, secret_key, (error, decoded) => { return decoded })
    } catch (error) {
        throw new Error("Invalid or missing token.")
    }
}

module.exports = { createToken, parseToken }