const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@CompanyDB.juofvkx.mongodb.net/CompanyDB?retryWrites=true&w=majority', {
        })
    } catch (err) {
        console.error(err)
    }
}


module.exports = connectDB
