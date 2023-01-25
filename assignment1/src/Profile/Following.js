import React from 'react'
import './Followers.css'


export default function Following(props) {

    const {visibility} = props
    let following = ["following1", "following2", "following3", "following4", "following5"]
    const listfollowing = following.map((value, index) => <li key={index}>{value}</li>)
    console.log(listfollowing);
    return (
        <div className="following" style={{visibility: visibility}}>
            <p>
                Following
            </p>
            <ul>
            {listfollowing}
            </ul>
        </div>
    )

}