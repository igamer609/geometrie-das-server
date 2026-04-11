// ----------------------------------------------------------
//	Copyright (c) 2026 igamer609 and Contributors
//	Licensed under the GNU AGPL v3 License.
//	See the LICENSE file in the project root for full license information
// ----------------------------------------------------------

function requirePermissionLevel(required_level, req, res, next){

    if(req.permission_level < required_level){
        return res.status(403).json({
            "success": false,
            "error": { "msg": "You don't have the required permissions to access this endpoint." }
        })
    }

    next()
}

module.exports = { requirePermissionLevel }