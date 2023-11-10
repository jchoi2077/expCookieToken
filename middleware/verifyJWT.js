const jwt = require('jsonwebtoken')


const verifyJWT = (req, res, next) => {
    
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401) // Unauthorized
    console.log(authHeader)
    const token = authHeader.split(' ')[1]
    jwt.verify(token, 'access_token', (err, decoded) => {
        if (err) return res.sendStatus(403) // Forbidden, invalid token
        req.user = decoded.UserInfo.username
        req.roles = decoded.UserInfo.roles
        next()
    })
}


module.exports = verifyJWT