import axios from 'axios'
import './SubGreddiitsdisplay.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'


export default function Subdisplay(props) {


    const navigate = useNavigate()
    const { details, subgreddiits, setsubgreddiits, user } = props
    let isfollowing
    if (details.followers && details.followers.includes(user))
        isfollowing = 1
    else
        isfollowing = 0
    let button

    function Leave() {
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/SubGreddiit/leave', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                name: details.name
            }
        }).then(res => {
            let newarray = [...subgreddiits]
            newarray[newarray.findIndex((value) => value.name === details.name)].followers = newarray[newarray.findIndex((value) => value.name === details.name)].followers.filter(value => value != user)

            setsubgreddiits(newarray)
        }).catch(error => {console.log(error.message)
        alert(error.message)})
    }
    function Join() {
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/SubGreddiit/join', {
            headers:
            {
                Authorization: `Bearer ${token}`
            }, params: {
                name: details.name
            }

        }).then(res => {
            let newrequest = [...subgreddiits]
            newrequest[newrequest.findIndex((test) => test.name === details.name)].joinrequests.push(user)
            setsubgreddiits(newrequest)
        })
            .catch(error => {console.log(error)
                alert(error.response.data)})
    }

    function Button() {
        if (isfollowing) {
            if (details.moderator != user)
                return button = <button className="JoinOrLeave" onClick={Leave}>Leave</button>
            else
                return button = <button disabled className="disabled">Leave</button>
        }
        else if (details.joinrequests) {
            if (details.joinrequests.includes(user))
                return button = <button disabled className="disabled">Requested</button>
            else
                return button = <button className="JoinOrLeave" onClick={Join} >Join</button>
        }

    }
    // function deletesubgreddiit(name,event) {
    //     console.log(event.target)
    //     const token = localStorage.getItem('token')
    //     const data={
    //         name: name
    //     }
    //     axios.post('https://greddiit-backend-l5kk.onrender.com/api/mysubgreddiit/deletesub', {
    //         headers : {
    //             Authorization: `Bearer ${token}`
    //         },
    //         data
    //     }).then(response => {
    //         let newgreddiits = mysubgreddiits.filter(sub => sub.name != name)
    //         console.log('delete', newgreddiits)
    //         setmysubgreddiits(newgreddiits)
    //     }).catch(error =>console.log(error.message))
    // }
    console.log(typeof(details))
    if (details) {
        return (
            <div className="wrappedsubdisplay" >
                <div className="subgreddiitdisplay" onClick={() => navigate(`/SubGreddiits/Posts/${details.name}`)}>
                    <div className="subgreddiitphoto">
                        <img src="https://img.icons8.com/ios-filled/50/null/groups.png" />
                    </div>
                    <div className="subgreddiittext">
                        <p>Name: {details.name}</p>
                        <p>Description: {details.description}</p>


                        <p>Banned Words: {
                            details.bannedkeywords.join(",")}</p>

                        <p>Followers: {details.followers.length}</p>
                        <p>posts: {details.posts.length}</p>
                        <p>Tags: {
                            details.tags.join(",")}</p>

                    </div>

                </div>
                <div className="buttons">
                    <Button />
                </div>
            </div >
        )
    }
    else
        return(
            <div></div>
        )
}