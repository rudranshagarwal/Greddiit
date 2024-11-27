import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import './Details.css'
import Followers from './Followers'
import Following from './Following'
import axios from 'axios'
import Edit from './Edit'

export default function Details() {

    const [showFollowers, setshowFollowers] = useState("hidden")
    const [showFollowing, setshowFollowing] = useState("hidden")
    const [details, setDetails] = useState({})
    const [didedit, setdidedit] = useState(false)
    
    useEffect(() => {
        const token = localStorage.getItem('token')

        
        
        axios.get(`http://localhost:3001/api/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response)
                console.log("Here")
                setDetails(response.data)
            })
            .catch(error => {

                console.log(error.message)
            })
    }, [])
    console.log(details)
    document.body.style.backgroundColor = "rgb(181, 89, 105)";

    const handleFollowers = (event) => {
        event.preventDefault();
        if (showFollowers === "hidden")
            setshowFollowers("visible")
        else
            setshowFollowers("hidden")
    }

    const handleFollowing = (event) => {
        event.preventDefault();
        if (showFollowing === "hidden")
            setshowFollowing("visible")
        else
            setshowFollowing("hidden")
    }


    // let widthtest = document.querySelector('.details');
    // let width = widthtest.offsetWidth;
    // console.log(width);
    console.log(Object.keys(details).length != 0)
    if (Object.keys(details).length != 0) {
        return (
            <div className="completeProfile">
                <Edit details={details} setDetails={setDetails} didedit={didedit} setdidedit={setdidedit} />
                <br />
                <div className="wrapped">

                    <Followers visibility={showFollowers} followers={details.followers} details={details} setDetails={setDetails} />
                    <div className="details">
                        <p>
                            Username: {details.username}
                        </p>
                        <p>
                            Name: {details.firstname} {details.lastname}
                        </p>
                        <a onClick={handleFollowers}>
                            Followers: {details.followers.length}
                        </a>
                        <br />
                        <br />
                        <a onClick={handleFollowing}>
                            Following: {details.following.length}
                        </a>
                        <p>
                            email: {details.email}
                        </p>
                        <p>
                            contact: {details.contact}
                        </p>
                        <p>
                            Age: {details.age}
                        </p>
                    </div>
                    <Following visibility={showFollowing} following={details.following} details={details} setDetails={setDetails}/>

                </div>
            </div>
        )
    }

}