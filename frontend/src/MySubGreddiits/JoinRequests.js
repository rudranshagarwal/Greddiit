import axios from 'axios'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './JoinRequests.css'
import NewNav from './NewNav'
import react from 'react'

export default function JoinReqeusts(props) {
    const { name } = useParams()
    const [joinrequests, setjoinrequests] = useState([])
    document.body.style.background = "rgb(31, 56, 216)"
    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get('http://localhost:3001/api/JoinRequests', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                name: name
            }
        }).then(response => {
            setjoinrequests(response.data)
        })
            .catch(error => console.log(error.message))

    }, [])

    function handleAccept(username,event){
        const token = localStorage.getItem('token')
        axios.post('http://localhost:3001/api/joinrequests/accept', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params:{
                username: username,
                name: name
            }
        }).then(res => {

            let newarray = joinrequests.filter(value => {
                return value.username != username
            })
            // newarray.splice(joinrequests.indexOf(username),1)

            setjoinrequests(newarray)
        }).catch(error => {
            console.log(error.message)
        })
    }

    function handleReject(username, event){
        const token = localStorage.getItem('token')
        axios.post('http://localhost:3001/api/joinrequests/reject', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params:{
                username: username,
                name: name
            }
        }).then(res => {

            let newarray = joinrequests.filter(value => {
                return value.username != username
            })
            // newarray.splice(joinrequests.indexOf(username),1)

            setjoinrequests(newarray)
        }).catch(error => {
            console.log(error.message)
        })
    }

    function Display(props) {
        const { details } = props
        if (details) {
            return (

                <div className="Requestab">
                    <div className="requestdec">
                        <p>Username:   {details.username}</p>
                        <p>Email:   {details.email}</p>
                    </div>
                    <div className="requestdec">
                        <p>Contact:   {details.contact}</p>
                        <p>Age:   {details.age}</p>
                    </div>
                    <button className="acceptrequest" onClick={handleAccept.bind(this, details.username)}>Accept</button>
                    <button className="rejectrequest" onClick={handleReject.bind(this,details.username)}>Reject</button>
                </div>
            )
        }
    }


    const display = joinrequests.map(details => {return <Display details={details} />} )

    return (
        <div>
            <NewNav name={name} />
            <div className="JoinRequests">

                {display}
            </div>
        </div>
    )
}