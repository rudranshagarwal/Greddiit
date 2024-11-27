const mongoose = require('mongoose')

require('dotenv').config()


const url = process.env.MONGO_URL

mongoose.set('strictQuery', false)

async function connection() {
    try{
        await mongoose.connect(url)
        console.log('connected to server')
    }
    catch(error) {
        console.log(error.message)
    }
}   

connection()

