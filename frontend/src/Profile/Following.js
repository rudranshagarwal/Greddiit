import React from 'react'
import './Followers.css'
import axios from 'axios'


export default function Following(props) {
    
    const { visibility, following,details, setDetails } = props
    
    if (following) {

        function handleUnfollow(value, event) {
            console.log(value)
            
            const token = localStorage.getItem('token')
            axios.post('http://localhost:3001/api/profile/unfollow',{
                headers: {
                    Authorization: `Bearer ${token}` 
                }, value:{
                    value
                }}).then(response => {
                    console.log(response)
                    const newfollowing = details.following.filter(following =>following != value)
                    setDetails({...details, following: newfollowing})
                    })
                .catch(error => console.log(error.message))
        }


        const listfollowing = following.map((value, index) => <div className="list" style={{ display: "flex", justifyContent: "space-between" }}>
        <li key={index}>{value}</li>
        <a onClick={handleUnfollow.bind(this, value)}>Unfollow</a>
        </div>)
    console.log(listfollowing);
        return (
            <div className="following" style={{ visibility: visibility }}>
                <p>
                    Following
                </p>
                <ul>
                    {listfollowing}
                </ul>
            </div>
        )
    }
}