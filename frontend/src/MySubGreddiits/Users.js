import './Users.css'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import NewNav from './NewNav'


export default function Users() {
    const { name } = useParams()
    const [users, setusers] = useState({})
    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get('http://localhost:3001/api/Users', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                name: name
            }
        }).then((response) => {
            setusers(response.data)
        }).catch((error) => {
            console.log(error.message)
        })
    }, [])

    const blocked = users.blocked
    const followers = users?.followers
    let notblockedfollowers
    if (followers && blocked)
        notblockedfollowers = followers.filter(value => !blocked.includes(value))
    let listoffollowers, listofblocked
    if (followers)
        listoffollowers = notblockedfollowers.map(value => <li>{value}</li>)
    if (blocked)
        listofblocked = blocked.map(value => <li>{value}</li>)
    document.body.style.background = "rgb(31, 56, 216)"
    return (
        <div className="UserPage">
            <NewNav name={name} />
            <div className="Users">
                <ul className="listoffollowers">
                    <li>Followers</li>
                    {listoffollowers}
                </ul>
                <ul className="listofblocked">
                    <li>Blocked</li>

                    {listofblocked}
                </ul>
            </div>
        </div>
    )
}