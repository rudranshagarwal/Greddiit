import React from 'react'
import './Following.css'


export default function Followers(props) {

    const {visibility} = props
    let followers = ["follower1", "follower2", "follower3", "follower4", "follower5"]
    const listfollowers = followers.map((value, index) => <li key={index}>{value}</li>)
    console.log(listfollowers);
    return (
        <div className="followers" style={{visibility: visibility}}>
            <p>
                Followers
            </p>
            <ul>
            {listfollowers}
            </ul>
        </div>
    )

}