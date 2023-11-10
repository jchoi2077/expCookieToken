const User = require('../model/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' })

    const foundUser = await User.findOne({ username: user }).exec()
    console.log(foundUser)
    if (!foundUser) return res.sendStatus(401) // Unauthorized

    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        // Define roles
        const roles = Object.values(foundUser.roles)
        console.log(roles)

        // create JWTs
        const accessToken = jwt.sign(
            { "UserInfo": {
                "username": foundUser.username, 
                "roles": roles 
            } 
        }, 'access_token', { expiresIn: '2m' })

        const refreshToken = jwt.sign({ "username": foundUser.username }, 'refresh_token', { expiresIn: '1d' })

        // Saving refreshToken to 'db' with current user
       foundUser.refreshToken = refreshToken
       const result = await foundUser.save()
       console.log(result)

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000 })
        res.json({ accessToken })
    } else {
        res.sendStatus(401) // Unauthorized
    }
}

module.exports = { handleLogin }
