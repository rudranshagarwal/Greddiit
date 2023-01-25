import React from 'react'
import { useState } from 'react'
import './Details.css'
import Followers from './Followers'
import Following from './Following'

export default function Details(props) {
    const { username } = props

    const [showFollowers, setshowFollowers] = useState("hidden")
    const [showFollowing, setshowFollowing] = useState("hidden")

    const getDetails = (username) => {
        const details = {
            username: 'admin',
            followers: ["follower1", "follower2", "follower3"],
            following: ["following1", "following2", "following3"],
            email: "admin@admin",
            age: 18,
        }
        return details
    }
    document.body.style.backgroundColor = "rgb(181, 89, 105)";
    const details = getDetails(username)

    const handleFollowers = (event) => {
        event.preventDefault();
        if(showFollowers === "hidden")
            setshowFollowers("visible")
        else    
            setshowFollowers("hidden")
    }

    const handleFollowing = (event) => {
        event.preventDefault();
        if(showFollowing === "hidden")
            setshowFollowing("visible")
        else    
            setshowFollowing("hidden")
    }


    // let widthtest = document.querySelector('.details');
    // let width = widthtest.offsetWidth;
    // console.log(width);
    return (
        <div className="wrapped">
            <Followers visibility={showFollowers} />
            <div className="details">
                <p>
                    Username: {details.username}
                </p>
                <a onClick={handleFollowers}>
                    Followers: {details.followers.length}
                </a>
                <br />
                <br />
                <a onClick={handleFollowing}>
                    Following: {details.followers.length}
                </a>
                <p>
                    email: {details.email}
                </p>
                <p>
                    Age: {details.age}
                </p>
            </div>
            <Following visibility={showFollowing} />

        </div>
    )
}