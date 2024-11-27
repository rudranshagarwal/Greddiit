const mongoconnect = require('./Database/mongooseconnect')
const User = require('./Database/User')
const SubGreddiit = require('./Database/SubGreddiit')
const Post = require('./Database/PostSchema')
const cors = require('cors')
const nodemailer = require('nodemailer');

const bcrypt = require('bcrypt')

const express = require('express')
const jwt = require('jsonwebtoken')
const { response } = require('express')

require('dotenv').config()

const app = express()
const removetime = Number(process.env.TIME_TAKEN)
app.use(cors())
app.use(express.json())

const email = process.env.EMAIL
const password = process.env.PASSWORD
// console.log(email)
// console.log(password)
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});




const token_verification = (request, response, next) => {
    // console.log(request.body.headers)
    const token = (request.headers["authorization"] || request.body.headers["Authorization"]).split(' ')[1]
    // console.log(request.headers["authorization"].split(' ')[1])

    if (!token) {
        return response.status(400).send("Token needed")
    }
    try {
        const user = jwt.verify(token, process.env.TOKEN)
        // console.log(user)
        request.user = user.user
        // console.log(request.user)
    }
    catch (error) {
        console.log("error")
        return response.status(400).send("wrong token")
    }
    next()
}


app.post('/api/Register', (request, response) => {
    async function register() {
        var validmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var validphone = /^[6-9]\d{9}$/
        if (!request.body.details.email?.match(validmailRegex) || !request.body.details.contact?.match(validphone) || !request.body.details.firstname || !request.body.details.lastname || !request.body.details.username
            || !request.body.details.password || Math.sign(request.body.details.age) <= 0)

            return response.status(400).send("Invalid details");

        const olduser = await User.findOne({ username: request.body.details.username })
        if (olduser) {
            // console.log("exists")
            return response.status(400).send("User exists");
        }
        else {
            const { firstname, lastname, username, email, age, contact, password } = request.body.details

            const token = jwt.sign({ user: username }, process.env.TOKEN)



            const encryptpassword = await bcrypt.hash(password, 10)
            if (!encryptpassword)
                response.status(304).send(error.message)

            let newuser = new User({
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                age: age,
                contact: contact,
                password: encryptpassword
            })

            console.log(newuser)
            newuser.save().then(user => {
                return response.status(200).send({ ...user, token: token })

            })
                .catch((error) => {
                    console.log(error.message)
                    return response.status(304).send(error.message)
                })
        }
    }
    register()
})

app.post('/api/Login', (request, response) => {
    async function login() {
        if (!request.body.details.username || !request.body.details.password)
            return response.status(200).send("Inavlid")
        const { username, password } = request.body.details

        try {
            const user = await User.findOne({ username: request.body.details.username })

            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ user: username }, process.env.TOKEN)
                response.status(200).send({ token: token })
            }
            else {
                return response.status(400).send("Wrong Password")
            }
            // console.log("exists")

        }
        catch (error) {
            return response.status(400).send("User does not exist")
        }
    }
    login()
})


app.get('/api/profile', token_verification, (request, response) => {
    const username = request.user
    async function search() {
        try {
            const user = await User.findOne({ username: username }, { _id: 0, __v: 0 })
            response.send(user)
        }
        catch (error) {
        }
    }
    search()
})

app.post('/api/profile/delete', token_verification, (request, response) => {
    const deletefollower = request.body.value.value
    const username = request.user
    User.findOne({ username: username }).then(res => {
        // console.log(res.followers)
        if (!res.followers.includes(deletefollower)) {
            return response.status(400).send("No follower")
        }
    })
        .catch(error => { return response.status(400).send("Wrong User") })
    User.findOne({ username: deletefollower }).then().catch(error => { return response.status(400).send("Wrong User") })

    User.findOneAndUpdate({ username: request.user }, { $pull: { followers: deletefollower } }, { new: true })
        .then(res => {
            // response.status(200).json(res)
            // console.log(res)
        })
        .catch(error => {
            console.log(error.message)
            return response.status(400).send("Could not remove follower")
        })
    User.findOneAndUpdate({ username: deletefollower }, { $pull: { following: username } }, { new: true })
        .then(res => {
            return response.status(200).send(res)
        })
        .catch(error => {
            return response.status(400).send("Could not remove follower")
        })
})


app.post('/api/profile/unfollow', token_verification, (request, response) => {
    const deletefollowing = request.body.value.value
    const username = request.user
    // console.log(username)
    User.findOne({ username: username }).then(res => {
        if (!res.following.includes(deletefollowing)) {
            return response.status(400).send("Not following")
        }
    })
        .catch(error => { return response.status(400).send("Wrong User") })
    User.findOne({ username: deletefollowing }).then().catch(error => { return response.status(400).send("Wrong User") })
    User.findOneAndUpdate({ username: request.user }, { $pull: { following: deletefollowing } }, { new: true })
        .then(res => {
            // response.status(200).json(res)
            // console.log(res)
        })
        .catch(error => {
            console.log(error.message)
            response.status(400).send("Could not remove following")
        })
    User.findOneAndUpdate({ username: deletefollowing }, { $pull: { followers: username } }, { new: true })
        .then(res => {
            return response.status(200).send(res)
        })
        .catch(error => {
            return response.status(400).send("Could not remove follower")
        })
})

app.post('/api/profile/edit', token_verification, (request, response) => {
    const { edit, changeto } = request.body.body
    const user = request.user
    // console.log(changeto)
    User.findOneAndUpdate({ username: user }, { [edit]: changeto }, { new: true, __v: 0, _id: 0 }).then(res => {
        response.status(200).send("edited")
    }).catch(error => {

        response.status(404).send(error.message)
    })
})

app.post('/api/MySubGreddiits/NewSubGreddiit', token_verification, (request, response) => {
    // console.log(request.body)
    const subgreddiit = new SubGreddiit({
        ...request.body.subgreddiitdetails,
        moderator: request.user,
        followers: [request.user]
    })

    // SubGreddiit.find({username: request.user}).then(resp =>{return response.status(400).send("SubGreddiit exixts")})
    // .catch(error => console.log("fine"))

    async function makeSubGreddiit() {

        const oldgreddiit = await SubGreddiit.findOne({ name: request.body.subgreddiitdetails.name })
        // console.log('old', oldgreddiit)
        if (oldgreddiit)
            return response.status(400).send("SubGreddiit exists")
        else {
            // console.log("Fine")
            subgreddiit.save().then(res => { return response.status(200).send(res) })
                .catch((error) => {
                    console.log(error.message);        // console.log(arrayofinfo)

                    return response.status(400).send(error.message)
                })
            User.findOneAndUpdate({ username: request.user }, { $push: { subgreddiits: subgreddiit.name } }, { new: true, _v: 0, __id: 0 }).then(res => { })
                .catch((error) => {
                    console.log(error.message);
                })
        }


    }
    makeSubGreddiit()


})

app.get('/api/getMySubGreddiits', token_verification, (request, response) => {
    SubGreddiit.find({ moderator: request.user }, { _id: 0, __v: 0 }).then(res => response.status(200).send(res))
        .catch(error => response.status(304).send(error.message))
})

app.get('/api/getSubGreddiits', token_verification, (request, response) => {
    SubGreddiit.find({}, { _id: 0, __v: 0 }).then(res => response.status(200).send({ array: res, user: request.user }))
        .catch(error => response.status(304).send(error.message))
})

app.post('/api/mysubgreddiit/deletesub', token_verification, (request, response) => {
    async function deletesubgreddiit() {
        let subgreddiit = await SubGreddiit.findOne({ name: request.body.data.name })
        if (subgreddiit) {
            // console.log(subgreddiit)
            if (subgreddiit.moderator === request.user) {
                try {
                    await SubGreddiit.findOneAndDelete({ name: subgreddiit.name })


                }
                catch (error) {
                    return response.status(500).send(error.message)
                }

                try {
                    // console.log(request.body.data.name)
                    const users = await User.updateMany({ subgreddiits: { $in: [request.body.data.name] } }, { $pull: { subgreddiits: request.body.data.name } })
                    return response.status(200).send("deleted")
                    // console.log(users)
                }
                catch (error) {
                    return response.status(500).send(error.message)

                }
            }
            else
                return response.status(404).send("Not Authorized")

        }
        else
            return response.status(404).send("Subgreddit does not exist")


    }
    deletesubgreddiit()
})


app.get('/api/Users', token_verification, (request, response) => {
    const name = request.query.name
    const username = request.user
    async function check() {
        try {
            const res = await SubGreddiit.findOne({ name: name })
            
            if(res.moderator !== username)
            {
                console.log("Here")
                return response.status(400).send("You are not moderator")
            }
            
        }
        catch (error) {
            console.log(error.message)
            return response.status(400).send(error.message)

        }
        SubGreddiit.findOne({ name: name }).then(res => {
            return response.status(200).send({ followers: res.followers, blocked: res.blocked })
        }).catch(error => {
            return response.status(404).send(error.message)
        })
    }
    check()
    
})

app.get('/api/JoinRequests', token_verification, (request, response) => {

    async function sendJoin() {
        const name = request.query.name
        const username = request.user
        let arrayofinfo = []

        try {
            const res = await SubGreddiit.findOne({ name: name })
            console.log(username)
            console.log(res.moderator)
            if(res.moderator !== username)
                return response.status(400).send("You are not moderator")
            
        }
        catch (error) {
            console.log(error.message)
            return response.status(400).send(error.message)

        }        
        try {
            const res = await SubGreddiit.findOne({ name: name })
            for (value of res.joinrequests) {
                try {

                    const res2 = await User.findOne({ username: value }, { _id: 0, __v: 0 })
                    arrayofinfo.push(res2)
                }
                catch (error) {
                    return response.status(404).send(error.message)
                }
            }
            response.status(200).send(arrayofinfo)

        }
        catch (error) {
            return response.status(404).send(error.message)
        }
        // console.log("sending", arrayofinfo)

        // console.log(arrayofinfo)
    }
    sendJoin()
})

app.post('/api/joinrequests/accept', (request, response) => {
    const username = request.body.params.username
    const name = request.body.params.name
    async function accept() {

        const time = new Date()
        const date = time.getDate()
        const month = time.getMonth()

        const timer = `${date} ${month}`
        try {
            const res = await User.findOne({ username: username })
            if (res.subgreddiits.includes(name))
                return response.status(400).send("Already following")
        }
        catch (error) {
            return response.status(400).send(error.message)
        }
        try {
            const res = await User.findOneAndUpdate({ username: username }, { $push: { subgreddiits: name } })
            // const res = SubGreddiit.findOneAndUpdate({username: username}, {$pull: {joinrequests: name}})


        }
        catch (error) {
            return response.status(404).send(error.message)
        }

        try {

            const res = await SubGreddiit.findOneAndUpdate({ name: name }, { $push: { followers: username } })

        }
        catch (error) {
            return response.status(404).send(error.message)
        }

        try {

            const res = await SubGreddiit.findOneAndUpdate({ name: name }, { $pull: { joinrequests: username } })

        }
        catch (error) {
            return response.status(404).send(error.message)
        }

        try {

            console.log("Here")
            let res = await SubGreddiit.findOne({ name: name }).lean()
            console.log(res)
            if (!res.joineduser || !(timer in res.joineduser)) {
                if (!res.joineduser)
                    res.joineduser = {}
                res.joineduser[timer] = 1
            }
            else {
                console.log(res.joineduser[timer])
                res.joineduser[timer] = res.joineduser[timer] + 1
            }
            console.log(res)
            try {
                const res2 = await SubGreddiit.findOneAndUpdate({ name: name }, res, { new: true })
            }
            catch (error) {
                return response.status(404).send(error.message)
            }
        }
        catch (error) {
            console.log(error.message)
            return response.status(404).send(error.message)
        }

        return response.status(200).send("success")
    }
    accept()
})

app.post('/api/joinrequests/reject', (request, response) => {
    const username = request.body.params.username
    const name = request.body.params.name
    async function reject() {

        try {
            const res = await User.findOne({ username: username })

            if (res.subgreddiits.includes(name))
                return response.status(400).send("Already following")
        }
        catch (error) {
            return response.status(400).send(error.message)
        }

        try {

            const res = await SubGreddiit.findOneAndUpdate({ name: name }, { $pull: { joinrequests: username } })

        }
        catch (error) {
            return response.status(404).send(error.message)
        }

        return response.status(200).send("success")
    }
    reject()
})


app.post('/api/SubGreddiit/join', token_verification, (request, response) => {
    const username = request.user
    const name = request.body.params.name

    async function Join() {
        try {
            const res = await User.findOne({ username: username })
            if (res.subgreddiits.includes(name))
                return response.status(400).send("Already following")
        }
        catch (error) {
            return response.status(400).send(error.message)
        }

        try {
            const res = await SubGreddiit.findOne({ name: name })

            if (res.joinrequests.includes(username))
                return response.status(400).send("requested")
        }
        catch (error) {

            return response.status(400).send(error.message)
        }

        try {
            const res = await User.findOne({ username: username })

            if (res.leftsubgreddiits.includes(name)) {
                return response.status(400).send("Cant join a subgreddiit which has been left")
            }
        }
        catch (error) {
            return response.status(400).send(error.message)

        }
        try {
            const res = await SubGreddiit.findOneAndUpdate({ name: name }, { $push: { joinrequests: username } })
        }
        catch (error) {
            return response.status(400).send(error.message)
        }
        return response.status(200).send("success request")
    }

    Join()
})

app.post('/api/SubGreddiit/leave', token_verification, (request, response) => {
    const username = request.user
    const name = request.body.params.name

    async function Leave() {
        try {

            const res = await User.findOne({ username: username })

            if (!res.subgreddiits.includes(name))
                return response.status(400).send("User does not follow")
        }
        catch (error) {
            // console.log("Here1")

            return response.status(400).send(error.message)
        }

        try {
            const res = await User.findOneAndUpdate({ username: username }, { $pull: { subgreddiits: name } })
            // console.log(res)

        }
        catch (error) {
            // console.log("Here2")
            return response.status(400).send(error.message)
        }
        try {
            const res = await User.findOneAndUpdate({ username: username }, { $push: { leftsubgreddiits: name } })
        }
        catch (error) {
            // console.log("Here3")

            return response.status(400).send(error.message)
        }
        try {
            const res = await SubGreddiit.findOneAndUpdate({ name: name }, { $pull: { followers: username } })
        }
        catch (error) {
            // console.log("Here4")

            return response.status(400).send(error.message)
        }

        return response.status(200).send("Left")
    }
    Leave()
})

app.get('/api/SubGreddiit/getinfo', token_verification, (request, response) => {
    const name = request.query.name
    const username = request.user
    async function returngreddiit() {
        const time = new Date()
        const date = time.getDate() 
        const month = time.getMonth()

        const timer = `${date} ${month}`
        try {
            const res = await SubGreddiit.findOne({ name: name }, { _id: 0, __v: 0 }).lean()
            let postids = res.posts
            let postsarray = []
            for (id of postids) {
                try {
                    let currpost = await Post.findById(id).lean()
                    // console.log(username)
                    if (res.moderator !== username && res.blocked?.includes(currpost.postedby)) {
                        currpost.postedby = "Blocked User"
                    }

                    postsarray.push(currpost)
                }
                catch (error) {
                    console.log(error.message)
                    return response.status(500).send(error.message)

                }
            }
            res.postsarray = postsarray
            res.username = request.user
            const res2 = await User.findOne({ username: username })
            res.savedposts = res2.savedposts
            try {

                console.log("Here")
                let resvisited = await SubGreddiit.findOne({ name: name }).lean()
                if (!resvisited.visiteduser || !(timer in resvisited.visiteduser)) {
                    if (!resvisited.visiteduser)
                        resvisited.visiteduser = {}
                    resvisited.visiteduser[timer] = [username]
                }
                else {
                    console.log(resvisited.visiteduser[timer])
                    if (resvisited.visiteduser[timer].indexOf(username) === -1)
                        resvisited.visiteduser[timer].push(username)
                }
                try {
                    const res2 = await SubGreddiit.findOneAndUpdate({ name: name }, resvisited, { new: true })
                }
                catch (error) {
                    return response.status(404).send(error.message)
                }
            }
            catch (error) {
                console.log(error.message)
                return response.status(404).send(error.message)
            }
            return response.status(200).send(res)
        }
        catch (error) {

            return response.status(404).send(error.message)
        }
    }
    returngreddiit()
})

app.post('/api/SubGreddiit/NewPost', token_verification, (request, response) => {
    async function NewPost() {
        const name = request.body.params.name
        const username = request.user
        let description = request.body.params.description
        let banned = false

        const time = new Date()
        const date = time.getDate() 
        const month = time.getMonth()

        const timer = `${date} ${month}`
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        try {
            const res = await User.find({ username: username })

        }
        catch (error) {
            return response.status(404).send("No User")
        }
        try {
            const currsub = await SubGreddiit.findOne({ name: name })
            let array = currsub.bannedkeywords
            if (array) {
                let reg = array.join("|")
                reg = new RegExp(reg, "gi")
                description = description.replace(reg, (match, offset, string) => {
                    let reply = ""
                    banned = true
                    for (let i = 0; i < match.length; i++) {
                        reply += '*'
                    }
                    return reply
                })
            }
            let Newpost = new Post({
                description: description,
                postedby: username,
                postedin: name
            })
            const res = await Newpost.save()

            let id = Newpost.id
            try {
                const res = await SubGreddiit.findOneAndUpdate({ name: name }, {
                    $push: {
                        posts: id
                    }
                })


            }
            catch (error) {
                console.log(error.message)
                return response.status(500).send("Could not make a post")
            }

        }
        catch (error) {
            console.log(error.message)

            return response.status(500).send("Could not make a post")
        }

        try {
            let res = await SubGreddiit.findOne({ name: name }, { _id: 0, __v: 0 }).lean()
            let postids = res.posts
            let postsarray = []
            for (id of postids) {
                try {
                    let currpost = await Post.findById(id)

                    postsarray.push(currpost)
                }
                catch (error) {
                    return response.status(500).send(error.message)
                }
            }
            res.postsarray = postsarray
            res.username = request.user
            try {

                console.log("Here")
                let postsupdate = await SubGreddiit.findOne({ name: name }).lean()
                if (!postsupdate.posted || !(timer in postsupdate.posted)) {
                    if (!postsupdate.posted)
                    postsupdate.posted = {}
                    postsupdate.posted[timer] = 1
                }
                else {
                    console.log(postsupdate.posted[timer])
                  
                    postsupdate.posted[timer]+= 1
                }
                try {
                    const res2 = await SubGreddiit.findOneAndUpdate({ name: name }, postsupdate, { new: true })

                }
                catch (error) {
                    return response.status(404).send(error.message)
                }
            }
            catch (error) {
                console.log(error.message)
                return response.status(404).send(error.message)
            }

            return response.status(200).send({ ...res, banned: banned })
        }
        catch (error) {

            return response.status(404).send("NO SubGreddiit")
        }
    }
    NewPost()
})

app.post('/api/SubGreddiit/upvote', token_verification, (request, response) => {
    async function upvote() {
        const name = request.body.params.name
        const username = request.user
        const id = request.body.params.id
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        try {
            let res = await Post.findById(id).lean()
            if (res.upvotes) {

                {
                    if (res.upvotes.includes(username)) {
                        return response.status(200).send(res)
                    }
                }
            }
            {

                if (res.downvotes) {
                    if (res.downvotes.includes(username))
                        res.downvotes = res.downvotes.filter(value => value != username)
                }
                if (res.upvotes)
                    res.upvotes.push(username)
                else
                    res.upvotes = [username]
                try {
                    const resp = await Post.findByIdAndUpdate(id, res, { new: true })

                    return response.status(200).send(resp)
                }
                catch (error) {
                    return response.status(500).send(error.message)
                }
            }

        }
        catch (error) {
            response.status(404).send(error.message)
        }

    }
    upvote()
})


app.post('/api/SubGreddiit/downvote', token_verification, (request, response) => {
    async function downvote() {
        const name = request.body.params.name
        const username = request.user
        const id = request.body.params.id
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        try {
            let res = await Post.findById(id).lean()
            if (res.downvotes) {

                {
                    if (res.downvotes.includes(username)) {
                        return response.status(200).send(res)
                    }
                }
            }
            {

                if (res.upvotes) {
                    if (res.upvotes.includes(username)) {
                        res.upvotes = res.upvotes.filter(value => value != username)
                    }
                }
                if (res.downvotes)
                    res.downvotes.push(username)
                else
                    res.downvotes = [username]
                try {
                    const resp = await Post.findByIdAndUpdate(id, res, { new: true })

                    return response.status(200).send(resp)
                }
                catch (error) {
                    return response.status(500).send(error.message)
                }
            }

        }
        catch (error) {

            response.status(404).send(error.message)
        }

    }
    downvote()
})


app.post('/api/follow', token_verification, (request, response) => {
    async function follow() {
        const username = request.user
        const postedby = request.body.params.postedby
        // console.log(request.body.params)
        if (postedby === username)
            return response.status(400).send("Cant follow yourself")
        try {
            const res = await User.find({ username: username })
        }
        catch (error) {
            response.status(400).send('Wrong user')
        }
        try {
            const res = await User.find({ username: postedby })
        }
        catch (error) {
            response.status(400).send('Wrong user')
        }
        try {
            const res = await User.findOne({ username: username })

            const res2 = await User.findOne({ username: postedby })
            if (res.following.includes(postedby) && res2.followers.includes(username))
                return response.status(200).send("success")
        }
        catch (error) {
            return response.status(500).send(error.message)
        }

        try {
            // console.log(postedby)
            const res = await User.findOneAndUpdate({ username: username }, { $push: { following: postedby } }, { new: true })
            const res2 = await User.findOneAndUpdate({ username: postedby }, { $push: { followers: username } })
            // console.log(res)

            return response.status(200).send("success")
        }
        catch (error) {
            return response.status(500).send(error.message)
        }
    }
    follow()
})

app.post('/api/SubGreddiit/newcomment', token_verification, (request, response) => {
    async function newcomment() {
        const name = request.body.params.name
        const username = request.user
        const id = request.body.params.id
        let comment = request.body.params.comment
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        try {
            const res = await User.find({ username: username })

        }
        catch (error) {
            return response.status(404).send("No User")
        }
        try {
            const res = await Post.findById(id)

        }
        catch (error) {
            return response.status(404).send("No Post")
        }
        try {

            const res = await Post.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true })

        }
        catch (error) {
            console.log(error.message)

            return response.status(500).send("Could not make a post")
        }

        try {

            let res = await SubGreddiit.findOne({ name: name }, { _id: 0, __v: 0 }).lean()
            let postids = res.posts
            let postsarray = []
            for (ids of postids) {

                try {
                    let currpost = await Post.findById(ids)

                    postsarray.push(currpost)
                }
                catch (error) {
                    return response.status(500).send(error.message)
                }
            }
            res.postsarray = postsarray
            res.username = request.user

            return response.status(200).send(res)
        }
        catch (error) {
            console.log(error.message)
            return response.status(404).send("NO SubGreddiit")
        }
    }
    newcomment()
})

app.post('/api/SubGreddiit/Report', token_verification, (request, response) => {
    async function report() {
        const name = request.body.params.name
        const username = request.user
        const id = request.body.params.id
        let concern = request.body.params.concern
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        try {
            const res = await User.find({ username: username })

        }
        catch (error) {
            return response.status(404).send("No User")
        }
        try {
            const res = await Post.findById(id)

        }
        catch (error) {
            return response.status(404).send("No Post")
        }
        try {
            let time = new Date().getTime()
            const res = await Post.findById(id)
            let report = {
                concern: concern,
                reportedby: username,
                description: res.description,
                reportuser: res.postedby,
                id: res.id,
                time: time,
                action: false
            }

            const res2 = await SubGreddiit.findOneAndUpdate({ name: name }, { $push: { reports: report }, 
            $inc: {reportedposts: 1} }, { new: true })

            

            return response.status(200).send("Success")

        }
        catch (error) {
            console.log(error.message)

            return response.status(500).send("Could not make a post")
        }
    }
    report()
})

app.get('/api/getreports', token_verification, (request, response) => {
    const name = request.query.name
    const username = request.user
    async function checkreports() {

        try {
            const res = await SubGreddiit.findOne({ name: name })
            console.log(username)
            console.log(res.moderator)
            if(res.moderator !== username)
                return response.status(400).send("You are not moderator")
            
        }
        catch (error) {
            console.log(error.message)
            return response.status(400).send(error.message)

        }
        try {
            const res = await SubGreddiit.findOne({ name: name }).lean()
            let currtime = new Date().getTime()
            res.reports = res.reports.filter(value => {
                console.log(currtime / 1000 - value.time / 1000)

                return ((currtime / 1000 - value.time / 1000) < removetime)
            })

            const res2 = await SubGreddiit.findOneAndUpdate({ name: name }, res, { new: true })

        }
        catch (error) {
            return response.status(500).send("error")
        }
        SubGreddiit.findOne({ name: name }).then(res => {
            return response.status(200).send(res)
        }).catch(error => {
            return response.status(404).send(error.message)
        })
    }
    checkreports()

    
})
app.post('/api/block', token_verification, (request, response) => {
    const name = request.body.params.name
    const blockuser = request.body.params.block
    const username = request.user
    let blockmail
    console.log("block")
    console.log(blockuser)
    async function block() {
        try {
            const res = await SubGreddiit.findOne({ name: name })
            console.log(res.blocked)
            if (res.blocked.includes(blockuser)) {
                console.log("Here2")
                return response.status(200).send("Already blocked")
            }
        }
        
        catch (error) {
            console.log(error.message)
            return response.status(404).send("No SubGreddiit")
        }

        try {
            const res = await User.findOne({ username: blockuser })
            blockmail = res.email
            // console.log(blockmail)

        }
        catch (error) {
            return response.status(404).send("No User")
        }
        try {
            const res = await SubGreddiit.findOneAndUpdate({ name: name }, { $addToSet: { blocked: blockuser } }, { new: true })
            console.log(res)
            // let mailoptionsreporter = {
            //     from: email,
            //     to: ,
            //     subject: 'Blocked from page',
            //     text: 'You have been blocked as someone reported you'
            // }
            let mailoptions = {
                from: email,
                to: blockmail,
                subject: 'Blocked from page',
                text: 'You have been blocked as someone reported you'
            }
            transporter.sendMail(mailoptions, (error, info) => {
                if (error) {
                    console.log(error)
                }
                else {
                    console.log('mail', info.response)
                }
            })



            return response.status(200).send("Success")

        }
        catch (error) {
            return response.status(500).send("Could not block")
        }
    }
    block()
})

app.post('/api/deletepost', token_verification, (request, response) => {
    const name = request.body.params.name
    const post = request.body.params.post
    let mailto
    async function deletepost() {
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        // const [subgreddiit, setsubgreddiit] = useState({})

        try {
            const res = await Post.findById(post.id)
            mailto = res.postedby
        }
        catch (error) {
            console.log(error.message)
            return response.status(404).send("No Post")
        }
        console.log(mailto)
        try {
            const res =await User.findOne({username: mailto})
            mailto = res.email
        }
        catch(error)
        {
            console.log(error.message)
            return response.status(404).send(error.message)
        }

        let mailoptions = {
            from: email,
            to: mailto,
            subject: 'Post deleted',
            text: 'Your post has been deleted'
        }
        transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log('mail', info.response)
            }
        })
        try {
            const res = await SubGreddiit.findOne({ name: name }).lean()
            res.reports = res.reports.filter(value => value.id !== post.id)
            res.posts = res.posts.filter(value => value !== post.id)
            if(res.deletedposts)
                res.deletedposts +=1 
            else 
                res.deletedposts = 1
            // console.log(res)
            const res2 = await SubGreddiit.findOneAndUpdate({ name: name }, res, { new: true })

            const res3 = await Post.findByIdAndDelete(post.id)
            return response.status(200).send("Success")
        }
        catch (error) {
            return response.status(500).send("Could not delete post")
        }
    }
    deletepost()
})

app.post('/api/savepost', token_verification, (request, response) => {
    async function save() {
        const username = request.user
        const post = request.body.params.post
        try {
            const res1 = await User.findOne({ username: username })
            if (res1.savedposts?.includes(post._id))
                return response.status(200).send("Success")
            const res = await User.findOneAndUpdate({ username: username }, { $push: { savedposts: post._id }})

            return response.status(200).send("Success")
        }
        catch (error) {
            return response.status(400).send(error.message)
        }
    }

    save()
})

app.post('/api/unsavepost', token_verification, (request, response) => {
    async function unsave() {
        const username = request.user
        const post = request.body.params.post
        try {

            const res = await User.findOneAndUpdate({ username: username }, { $pull: { savedposts: post._id } })

            return response.status(200).send("Success")
        }
        catch (error) {
            return response.status(400).send(error.message)
        }
    }

    unsave()
})

// app.get('/api/getsavedposts', token_verification, (request, response) => {
//     const username = request.user
//     async function savedposts() {
//         try {
//             const res = await User.findOne({ username: username })
//             const arrayofposts =[]
//             for (value of res.savedposts) {
//                 try {

//                     const res2 = await Post.findById(value)
//                     arrayofposts.push(res2)
//                 }
//                 catch (error) {
//                     return response.status(404).send(error.message)
//                 }
//             }
//             return response.status(200).send(arrayofposts)
//         }

//         catch (error) {
//             response.status(400).send(error.message)
//         }
//     }
//     savedposts()
// })

app.get('/api/getsavedposts', token_verification, (request, response) => {
    const username = request.user
    async function returngreddiit() {
        try {
            const res = await User.findOne({ username: username })

            let postids = res.savedposts ? res.savedposts : []
            // console.log(postids)
            let postsarray = []
            for (id of postids) {
                try {
                    let currpost = await Post.findById(id).lean()
                    // console.log(username)
                    if (res.moderator !== username && res.blocked?.includes(currpost.postedby)) {
                        currpost.postedby = "Blocked User"
                    }

                    postsarray.push(currpost)
                }
                catch (error) {
                    console.log(error.message)
                    return response.status(500).send(error.message)

                }
            }
            return response.status(200).send({ savedposts: postsarray, username: username })
        }
        catch (error) {

            return response.status(404).send(error.message)
        }
    }
    returngreddiit()
})


app.post('/api/newcomment', token_verification, (request, response) => {
    async function newcomment() {
        let name;
        const username = request.user
        const id = request.body.params.id
        let comment = request.body.params.comment
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        try {
            const res = await User.find({ username: username })

        }
        catch (error) {
            return response.status(404).send("No User")
        }
        try {
            const res = await Post.findById(id)
            name = res.postedin

        }
        catch (error) {
            return response.status(404).send("No Post")
        }
        try {

            const res = await Post.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true })

        }
        catch (error) {
            console.log(error.message)

            return response.status(500).send("Could not make a post")
        }

        try {

            let res = await User.findOne({ username: username }, { _id: 0, __v: 0 }).lean()
            let postids = res.savedposts
            let postsarray = []
            for (ids of postids) {

                try {
                    let currpost = await Post.findById(ids)

                    postsarray.push(currpost)
                }
                catch (error) {
                    return response.status(500).send(error.message)
                }
            }
            // console.log(postsarray)
            return response.status(200).send(postsarray)
        }
        catch (error) {
            console.log(error.message)
            return response.status(404).send(error.essage)
        }
    }
    newcomment()
})

app.post('/api/Report', token_verification, (request, response) => {
    async function report() {
        let name
        const username = request.user
        const id = request.body.params.id
        let concern = request.body.params.concern
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        try {
            const res = await User.find({ username: username })

        }
        catch (error) {
            return response.status(404).send("No User")
        }
        try {
            const res = await Post.findById(id)
            name = res.postedin
        }
        catch (error) {
            return response.status(404).send("No Post")
        }
        try {
            let time = new Date().getTime()
            const res = await Post.findById(id)
            let report = {
                concern: concern,
                reportedby: username,
                description: res.description,
                reportuser: res.postedby,
                id: res.id,
                time: time
            }

            const res2 = await SubGreddiit.findOneAndUpdate({ name: name }, { $push: { reports: report } }, { new: true })

            return response.status(200).send("Success")

        }
        catch (error) {
            console.log(error.message)

            return response.status(500).send("Could not make a post")
        }
    }
    report()
})

app.post('/api/upvote', token_verification, (request, response) => {
    async function upvote() {
        let name
        const username = request.user
        const id = request.body.params.id
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        try {
            let res = await Post.findById(id).lean()
            name = res.postedin
            if (res.upvotes) {

                {
                    if (res.upvotes.includes(username)) {
                        return response.status(200).send(res)
                    }
                }
            }
            {

                if (res.downvotes) {
                    if (res.downvotes.includes(username))
                        res.downvotes = res.downvotes.filter(value => value != username)
                }
                if (res.upvotes)
                    res.upvotes.push(username)
                else
                    res.upvotes = [username]
                try {
                    const resp = await Post.findByIdAndUpdate(id, res, { new: true })

                    return response.status(200).send(resp)
                }
                catch (error) {
                    return response.status(500).send(error.message)
                }
            }

        }
        catch (error) {
            response.status(404).send(error.message)
        }

    }
    upvote()
})


app.post('/api/downvote', token_verification, (request, response) => {
    async function downvote() {
        let name
        const username = request.user
        const id = request.body.params.id
        try {
            const res = await SubGreddiit.find({ name: name })

        }
        catch (error) {
            return response.status(404).send("No SubGreddiit")
        }
        try {
            let res = await Post.findById(id).lean()
            name = res.postedin
            if (res.downvotes) {

                {
                    if (res.downvotes.includes(username)) {
                        return response.status(200).send(res)
                    }
                }
            }
            {

                if (res.upvotes) {
                    if (res.upvotes.includes(username)) {
                        res.upvotes = res.upvotes.filter(value => value != username)
                    }
                }
                if (res.downvotes)
                    res.downvotes.push(username)
                else
                    res.downvotes = [username]
                try {
                    const resp = await Post.findByIdAndUpdate(id, res, { new: true })

                    return response.status(200).send(resp)
                }
                catch (error) {
                    return response.status(500).send(error.message)
                }
            }

        }
        catch (error) {

            response.status(404).send(error.message)
        }

    }
    downvote()
})

app.get('/api/Stats', token_verification, (request, response) => {
    const name = request.query.name
    const username = request.user
    async function getStats() {
        try {
            const res = await SubGreddiit.findOne({ name: name })

            if(res.moderator !== username)
            return response.status(400).send("You are not moderator")
            
        }
        catch (error) {
            console.log(error.message)
        }
        try {
            const res = await SubGreddiit.findOne({ name: name })
            
            return response.send({
                joineduser: res?.joineduser,
                visiteduser: res?.visiteduser,
                reportdelete: [res?.reportedposts, res?.deletedposts],
                posted: res?.posted
            })
        }
        catch (error) {
            console.log(error.message)
        }
    }

    getStats()
})

const PORT = 3001 || process.env.PORT


app.listen(PORT)
