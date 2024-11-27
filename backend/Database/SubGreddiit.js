var mongoose = require('mongoose')

const SubGreddiitSchema = new mongoose.Schema({
    name: String,
    description: String,
    posts: [String],
    bannedkeywords: [String],
    followers: [String],
    tags: [String],
    moderator: String,
    date: Object,
    blocked: [String],
    joinrequests: [String],
    reports: [],
    joineduser: Object,
    visiteduser: Object,
    deletedposts: Number,
    reportedposts: Number,
    posted: Object
})


module.exports = mongoose.model('SubGreddiit', SubGreddiitSchema)