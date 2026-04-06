// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

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
            errorMessage: "Username must be between 3 and 32 characters long."
        },
        escape: true,
    },
    password: {
        isLength: {
            options: {min: 8, max: 32},
            errorMessage: "Password must be between 8 and 32 characters long."
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