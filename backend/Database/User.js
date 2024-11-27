var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    followers: [String],
    following: [String],
    email: String,
    age: String,
    firstname: String, 
    lastname: String,
    contact: String,
    subgreddiits: [String],
    leftsubgreddiits: [String],
    savedposts: [String]
})


module.exports = mongoose.model('User', userSchema)