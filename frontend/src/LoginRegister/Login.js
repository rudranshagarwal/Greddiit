import React from 'react'
import './Login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


export default function Login() {

    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState({
        UserName: "",
        Password: ""
    })

    

    const changeHandler = (event) => {
        const { placeholder, value } = event.target;

        const tempObject = {
            ...userDetails,
            [placeholder]: value
        }

        setUserDetails(tempObject);
    }

    function validate() {
        if(!userDetails.UserName || !userDetails.Password)
            return true;
        else 
            return false;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("Here")
        const username = event.target[0].value
        const password = event.target[1].value
        let details = {
            username: username,
            password: password
        }
        try {
            const response = await axios.post('http://localhost:3001http://localhost:3001/api/Login', { details })

            console.log(response.data.token)
            localStorage.setItem('token', response.data.token)
            navigate('/Profile')
        }
        catch (error) {
            console.log("Here")
            navigate('/')
            console.log(error.response.data)
        }
        // localStorage.setItem("username") = 
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="login-form">
                <input placeholder="UserName" type="text" value={userDetails.UserName} onChange={changeHandler}></input>
                <input placeholder="Password" type="password" value={userDetails.Password} onChange={changeHandler}></input>
                <input type="submit" disabled={validate()}></input>
            </form>
        </div>
    )
}