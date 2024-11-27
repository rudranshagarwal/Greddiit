import React from 'react'
import './Logout.css'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
    const navigate = useNavigate()

    const Clickhandler = () => {


        localStorage.removeItem("token")
        console.log("loggingout")
        
        navigate("/Login")
        
    }

    return (
        <button className="logout" onClick={Clickhandler}>Logout</button>
    )

}