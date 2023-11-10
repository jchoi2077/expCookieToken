require('dotenv').config()
const express = require('express')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
connectDB()

const app = express()


// built-in middleware to handle urlencoded data. In other words, form-data: 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

// serve static files
// app.use(express.static(path.join(__dirname, '/public')))

// Cross Origin Resource Sharing
app.use(cors(corsOptions))

// middleware for Cookies
app.use(cookieParser())



app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

// Everything below the verifyJWT middleware will be affected
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))




mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(3500, () => {console.log('3500')})
})