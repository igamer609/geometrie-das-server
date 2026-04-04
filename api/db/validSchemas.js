const { checkSchema } = require("express-validator")

const userSignUpCheck = checkSchema({
    username: {
        trim: true,
        isAlphanumeric: {
            options: ["en-US"],
            errorMessage: "Username must only contain alphanumerical characters.",
        },
        isLength: {
            options: {min: 3, max: 25},
            errorMessage: "Username must be between 3 and 25 characters long."
        },
        escape: true,
    },
    password: {
        isLength: {
            options: {min: 3, max: 25},
            errorMessage: "Username must be between 3 and 25 characters long."
        },
        custom: {
            options: (pass) => {
                if(/\s/.test(pass) == true){
                    throw new Error("Password mustn't contain spaces or tabs.")
                }
                return true
            },
        }
    }
}, ["body"])

module.exports = { userSignUpCheck }