// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

const { checkSchema } = require("express-validator")
const semverGte = require("semver/functions/gte")

const MIN_GAME_VERSION = process.env.MIN_GAME_VERSION || "2.0.0-beta.6"

const userRegisterCheck = checkSchema({
    username: {
        trim: true,
        isAlphanumeric: {
            options: ["en-US"],
            errorMessage: "Username must only contain alphanumerical characters.",
        },
        isLength: {
            options: {min: 3, max: 25},
            errorMessage: "Username must be between 3 and 32 characters long.",
        },
        escape: true,
    },
    password: {
        isLength: {
            options: {min: 8, max: 32},
            errorMessage: "Password must be between 8 and 32 characters long.",
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

const levelUploadCheck = checkSchema({
    title: {
        custom: {
            options: (title) => {
                title.replace(/\s/g, " ")
            }
        },
        isAlphanumeric: {
            options: ["en-US"],
            errorMessage: "Username must only contain alphanumerical characters.",
        },
        isLength: {
            options: {min: 3, max: 25},
            errorMessage: "Username must be between 3 and 32 characters long.",
        },
        escape: true,
    },
    description: {
        escape: true,
    },
    song_id: {
        isInt: true,
    },
    rate_req: {
        isInt: {
            options: {min: 0, max: 10}
        },
    },
    original_id: {
        isInt: {
            options: {min: -1}
        },
    },
    version: {
        isEmpty: true,
        isSemVer: {
            options: {
                includePrerelease: true,
                errorMessage: `Use a valid version format, e.g. 2.0.0 or ${MIN_GAME_VERSION}`,
            },
            custom: {
                options: (version) => {
                    if(semverGte(version, MIN_GAME_VERSION) == true){
                        throw new Error(`Game version must greater or equal to ${MIN_GAME_VERSION}.`)
                    }
                    return true
                },
            },
        },
    },
    level_data: {
        notEmpty: {
            errorMessage: "No level data provided. Please retry publishing the level.",
        },
        isBase64: {
            errorMessage: "Level data is in an invalid format. Please retry publishing the level.",
        },
    }

})

module.exports = { userSignUpCheck }