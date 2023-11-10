const User = require('../model/User')
const jwt = require('jsonwebtoken')


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401)
    console.log(cookies.jwt)

    const refreshToken = cookies.jwt

    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) return res.sendStatus(403) // Forbidden

    // Evaluate JWT
    jwt.verify(refreshToken, 'refresh_token', (err, decoded) => {
        if (err || foundUser.username !== decoded.username) return res.sendStatus(403) // Forbidden

        const roles = Object.values(foundUser.roles)

        const accessToken = jwt.sign({ 
            "UserInfo": {
                "username": decoded.username,
                "roles": roles
        }}, 'access_token', { expiresIn: '1m'})
        res.json({ accessToken })
    })
}

module.exports = { handleRefreshToken }