import React from 'react'
import './Following.css'
import axios from 'axios'

export default function Followers(props) {

    const { visibility, followers, details,setDetails } = props
    console.log(followers)
    if (followers) {

        function handleDelete(value, event) {
            console.log(value)
            
            const token = localStorage.getItem('token')
            axios.post('https://greddiit-backend-l5kk.onrender.com/api/profile/delete',{
                headers: {
                    Authorization: `Bearer ${token}` 
                }, value:{
                    value
                }}).then(response => {console.log("Here")
                    const newfollowers = details.followers.filter(follower => follower != value)
                    console.log(newfollowers)
                    setDetails({...details, followers: newfollowers})})
                    .catch(error => console.log(error.message))
        }

        const listfollowers = followers.map((value, index) => <div className="list" style={{ display: "flex", justifyContent: "space-between" }}>
            <li key={index}>{value}</li>
            <a onClick={handleDelete.bind(this, value)}>Delete</a>
        </div>)
        console.log(listfollowers);


        return (
            <div className="followers" style={{ visibility: visibility }}>
                <p>
                    Followers
                </p>

                <ul>
                    {listfollowers}
                </ul>
            </div>
        )
    }
}