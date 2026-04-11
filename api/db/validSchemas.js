// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

const { checkSchema } = require("express-validator")
const semverGte = require("semver/functions/gte")
const semverValid = require("semver/functions/valid")

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
                if (!/^[a-zA-Z0-9 ]+$/.test(title)) {
                    throw new Error("Title must only contain alphanumeric characters and spaces.");
                }
                return true;
            }
        },
        isLength: {
            options: {min: 1, max: 25},
            errorMessage: "Title must be between 1 and 32 characters long.",
        },
        escape: true,
    },
    description: {
        optional: true,
        escape: true,
    },
    song_id: {
        isInt: true,
    },
    rate_req: {
        optional: true,
        isInt: {
            options: {min: 0, max: 10}
        },
    },
    original_id: {
        optional: true,
        isInt: {
            options: {min: -1}
        },
    },
    version: {
        custom: {
            options: (version) => {

                if(semverValid(version) == null){
                    throw new Error('Invalid version format.')
                }

                if(semverGte(version, MIN_GAME_VERSION) == false){
                    throw new Error(`Game version must greater or equal to ${MIN_GAME_VERSION}.`)
                }

                return true
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

}, ["body"])

const commentCheck = checkSchema({
    content: {
        isLength: {
            options: {min: 1, max: 250},
            errorMessage: "Comment must be between 1 and 250 characters long.",
        },
        escape: true,
    },
    scope: {
        isIn: {
            options: [["level", "comment"]],
            errorMessage: "Invalid comment scope. Must be either 'level' or 'comment'.",
        },
    }
}, ["body"])

const ratingCheck = checkSchema({
    rating: {
        isInt: {
            options: {min: 0, max: 10},
            errorMessage: "Rating must be an integer between 0 and 10.",
        },
    },
}, ["body"])

module.exports = { userRegisterCheck, levelUploadCheck, commentCheck, ratingCheck }