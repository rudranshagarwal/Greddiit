import './Posts.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../Navbar'
import Modal from 'react-modal'
import pic from '../reddit.png'
import axios from 'axios'

export default function Posts() {
    const { name } = useParams()
    const [isOpen, setisOpen] = useState(0)
    const [iscomment, setiscomment] = useState(0)
    const [comment, setcomment] = useState("")
    const [Post, setPost] = useState("")
    const [addcommentstring, setaddcommentstring] = useState("")
    const [subgreddiit, setsubgreddiit] = useState({})
    const [showreport, setshowreport] = useState(0)
    const [reportdetails, setreportdetails] = useState("")
    const [savedposts, setsavedposts] = useState([])

    document.body.style.backgroundColor = "	#DCDCDC"

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-10%',
            backgroundColor: 'transparent',
            border: 'None',
            height: '500px',
            width: '50%',
            paddingTop: '15%',
            transform: 'translate(-50%, -50%)',
        },

    };

    function handleNewPost(event) {
        setisOpen(!isOpen)
    }

    function handleSubmit(event) {
        event.preventDefault()
        setisOpen(false)
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/SubGreddiit/NewPost', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                name: name,
                description: Post
            }
        }).then(res => {
            if (res.data.banned === true)
                alert("Your post has banned words")
            setsubgreddiit(res.data)
            setPost("")
        }).catch(error => {
            console.log(error.message)
        })
    }

    function handleSubmitcomment(event) {
        event.preventDefault()
        setiscomment(false)
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/SubGreddiit/newcomment', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                id: addcommentstring,
                comment: comment,
                name: name
            }
        }).then(res => {

            setsubgreddiit(res.data)
            setcomment("")
        }).catch(error => {
            console.log(error.message)
        })
    }

    function addcomment(post, event) {
        setiscomment(!iscomment)
        setaddcommentstring(post._id)
    }

    function changeHandler(event) {
        setPost(event.target.value)
    }

    function changeHandlercomment(event) {
        setcomment(event.target.value)
    }

    function changeHandlerreport(event) {
        setreportdetails(event.target.value)
    }

    function closeModal(event) {
        setPost("")
        setisOpen(false)
    }

    function closeModalcomment(event) {
        setcomment("")
        setiscomment(false)
        setaddcommentstring("")
    }

    function closeModalreport(event) {
        setreportdetails("")
        setshowreport(false)
        setaddcommentstring("")
    }

    function showreportmodal(post, event) {
        setshowreport(!showreport)
        setaddcommentstring(post._id)
    }

    function Report(event) {
        event.preventDefault()
        setshowreport(false)
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/SubGreddiit/Report', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                name: name,
                concern: reportdetails,
                id: addcommentstring
            }
        }).then(res => {

            setreportdetails("")
        }).catch(error => {
            console.log(error.message)
        })
    }
    function follow(post, event) {
        let token = localStorage.getItem('token')
        console.log(post)
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/follow', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                postedby: post.postedby
            }
        }).then(res => console.log(res.data))
            .catch(error => console.log(error.message))
    }

    function upvote(post, event) {
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/SubGreddiit/upvote', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                name: name,
                id: post._id
            }
        }).then(res => {
            let array = [...subgreddiit.postsarray]
            array = array.map(value => {
                if (value._id === post._id) {
                    console.log(res.data)

                    if (res.body !== "exists")
                        return res.data
                }
                return value
            })
            let newsubgreddiit = { ...subgreddiit }
            newsubgreddiit.postsarray = array
            console.log(newsubgreddiit)
            setsubgreddiit(newsubgreddiit)
        }).catch(error => console.log(error))
    }

    function downvote(post, event) {
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/SubGreddiit/downvote', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                name: name,
                id: post._id
            }
        }).then(res => {
            let array = [...subgreddiit.postsarray]
            array = array.map(value => {
                if (value._id === post._id) {
                    console.log(res.data)

                    if (res.body !== "exists")
                        return res.data
                }
                return value
            })
            let newsubgreddiit = { ...subgreddiit }
            newsubgreddiit.postsarray = array
            console.log(newsubgreddiit)
            setsubgreddiit(newsubgreddiit)
        }).catch(error => console.log(error))
    }

    function savepost(post, event){
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/savepost', {
            headers:{
                Authorization: `Bearer ${token}`
            }, params: {
                post: post
            }
            
        }).then(res => {
            setsavedposts([...savedposts, post._id])
        }).catch(error => 
            console.log(error.message))
    }

    function unsavepost(post, event){
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/unsavepost', {
            headers:{
                Authorization: `Bearer ${token}`
            }, params: {
                post: post
            }
            
        }).then(res => {
            setsavedposts(savedposts.filter(value => value != post._id))
        }).catch(error => 
            console.log(error.message))
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get("https://greddiit-backend-l5kk.onrender.com/api/SubGreddiit/getinfo", {
            headers:
            {
                Authorization: `Bearer ${token}`
            }
            ,
            params: {
                name: name
            }
        }).then(response => {
            setsubgreddiit(response.data)
            setsavedposts(response.data.savedposts ? response.data.savedposts : [])
        })
            .catch(error => console.log(error.message))

    }, [])

    function Postdisplay(props) {
        const { post } = props
        const [showcomment, setshowcomment] = useState(false)
        function showcomments() {
            setshowcomment(!showcomment)
        }
        let save
        if (!savedposts?.includes(post._id))
            save = <img onClick={savepost.bind(this, post)} className="Save" src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/null/external-bookmark-social-media-ui-tanah-basah-basic-outline-tanah-basah.png" />
        else
            save = <img onClick={unsavepost.bind(this, post)} className="Saved" src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/null/external-bookmark-library-tanah-basah-glyph-tanah-basah.png" />

        function Comment(props) {
            const { comment } = props
            return (<div className="commentbody">
                <p>{comment}</p>
            </div>)
        }
        let comments = post.comments.map(value => {
            return <Comment comment={value} />
        })
        if (!showcomment) {
            return (
                <div className="Postdisplay">
                    <div className="Posttext">
                        <p>
                            {post.description}
                        </p>
                        <p>Posted By: {post.postedby}</p>

                    </div>
                    <div className="Postsextra">
                        <a onClick={addcomment.bind(this, post)}>Add comment   </a>
                        <a onClick={showcomments}>    Comments</a>
                        <a onClick={showreportmodal.bind(this, post)}>Report </a>
                        <a onClick={follow.bind(this, post)} style={{ visibility: post.postedby === subgreddiit.username ? "hidden" : "visible " }}>Follow </a>
                        <img onClick={upvote.bind(this, post)} className="Upvote" src="https://img.icons8.com/dusk/64/null/facebook-like.png" style={{ visibility: post.upvotes?.includes(subgreddiit.username) ? "hidden" : "visible" }} />
                        <img onClick={downvote.bind(this, post)} className="Downvote" src="https://img.icons8.com/dusk/64/null/thumbs-down.png" style={{ visibility: post.downvotes?.includes(subgreddiit.username) ? "hidden" : "visible" }} />

                        {save}

                    </div>

                </div>
            )
        }
        else {
            return (
                <div className="Postdisplay">
                    <div className="Posttext">
                        <p>
                            {post.description}
                        </p>
                        <p>Posted By: {post.postedby}</p>

                    </div>

                    <div className="Postsextra">
                        <a onClick={addcomment.bind(this, post)}>Add comment   </a>
                        <a onClick={showcomments}>    Comments</a>
                        <a onClick={showreport}>Report </a>
                        <a onClick={follow.bind(this, post)} style={{ visibility: post.postedby === subgreddiit.username ? "hidden" : "visible " }}>Follow </a>
                        <img onClick={upvote.bind(this, post)} className="Upvote" src="https://img.icons8.com/dusk/64/null/facebook-like.png" style={{ visibility: post.upvotes?.includes(subgreddiit.username) ? "hidden" : "visible" }} />
                        <img onClick={downvote.bind(this, post)} className="Downvote" src="https://img.icons8.com/dusk/64/null/thumbs-down.png" style={{ visibility: post.downvotes?.includes(subgreddiit.username) ? "hidden" : "visible" }} />
                        {save}

                    </div>
                    <div className="bodyofcomments">
                        {comments}
                    </div>

                </div>
            )
        }
    }
    let posts
    if (subgreddiit.postsarray) {

        posts = subgreddiit.postsarray.map(currpost => { return <Postdisplay post={currpost} /> })
    }


    console.log(subgreddiit)
    if (subgreddiit.followers) {
        return (
            <div className="Posts">
                <Navbar />
                <div className="Newpost" onClick={handleNewPost}>
                    <img src="https://img.icons8.com/external-regular-kawalan-studio/24/null/external-new-post-social-media-regular-kawalan-studio.png" className="Newpostphoto"></img>
                    <p>New Post</p>
                </div>
                <div className="bodyofposts">
                    <div className="detailsonpage">
                        <img className="reddiit" src={pic}></img>
                        <p>Name: {subgreddiit.name}</p>
                        <p>Description: {subgreddiit.description}</p>
                        <p>Followers: {subgreddiit.followers.length}</p>
                        <p>tags: {subgreddiit.tags.join(',')}</p>
                        <p>Banned Words: {subgreddiit.bannedkeywords.join(',')}</p>
                    </div>
                    <div className="listofposts">
                        {posts}
                    </div>
                </div>
                <Modal isOpen={isOpen} style={customStyles} onRequestClose={closeModal} portalClassName="ModalPosts">
                    <p>Text: </p>
                    <form onSubmit={handleSubmit} className="post-form">
                        <textarea type="text" value={Post} onChange={changeHandler}></textarea>
                        <input type="submit" ></input>
                    </form>
                </Modal>
                <Modal isOpen={iscomment} style={customStyles} onRequestClose={closeModalcomment} portalClassName="ModalPosts">
                    <p>comment: </p>
                    <form onSubmit={handleSubmitcomment} className="post-form">
                        <textarea type="text" value={comment} onChange={changeHandlercomment}></textarea>
                        <input type="submit" ></input>
                    </form>
                </Modal>
                <Modal isOpen={showreport} style={customStyles} onRequestClose={closeModalreport} portalClassName="ModalPosts">
                    <p>Concern: </p>
                    <form onSubmit={Report} className="post-form">
                        <textarea type="text" value={reportdetails} onChange={changeHandlerreport}></textarea>
                        <input type="submit" ></input>
                    </form>
                </Modal>
            </div>
        )
    }
}