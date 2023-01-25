import React from 'react'
import './Login.css'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'


export default function Login(props) {
    
    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState({
        UserName: "",
        Password: "" 
    })

    const changeHandler = (event) =>
    {
        const {placeholder, value} = event.target;

        const tempObject = {
            ...userDetails,
            [placeholder]: value
        }

        setUserDetails(tempObject);
    }

    const handleSubmit = (event) =>
    {
        event.preventDefault();
        console.log("Here")
        const username = event.target[0].value
        const password = event.target[1].value
        if(username === "admin" && password === "admin")
        {
            console.log("atchange")
            localStorage.setItem("loggedin", 1)
            navigate("/Profile")
        }
        // localStorage.setItem("username") = 
    }

    return (
        <div>
        <form onSubmit={handleSubmit} className="login-form">
            <input placeholder="UserName" type="text" value={userDetails.UserName} onChange={changeHandler}></input>
            <input placeholder="Password" type="password" value={userDetails.Password} onChange={changeHandler}></input>
            <input type="submit" ></input>
        </form>
        </div>
    )
}