var mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    description: String,
    postedby: String,
    postedin: String,
    upvotes: [String],
    downvotes: [String],
    comments: [String],
})

module.exports = mongoose.model('Post', PostSchema)