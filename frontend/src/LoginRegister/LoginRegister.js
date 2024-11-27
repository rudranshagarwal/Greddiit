import React from 'react'
import Register from './Register'
import Login from './Login'
import { useState } from 'react'
import './LoginRegister.css'
// import {Navigate} from 'react-router-dom'


export default function Renderer(props) {


    const [pageToRender, setPageToRender] = useState(0);
    const clickhandler = (event) => {
        const buttonid = event.target.id
        setPageToRender(buttonid)
        console.log(pageToRender)
    }



    const RenderPage = () => {
        if (pageToRender === "1")
            return (
                <Register />
            )
        else
            return (
                <Login />
            )
    }

    const Heading = () => {
        return (
            <div className="wrapper one">
                <div className="drop-main">
                    <div className="g">G</div>
                    <div className="r">R</div>
                    <div className="e">E</div>
                    <div className="d">D</div>
                    <div className="d2">D</div>
                    <div className="i">I</div>
                    <div className="i2">I</div>
                    <div className="t">T</div>
                </div>
            </div>
        )
    }
    document.body.style.backgroundColor = "#242124";

    return (
        <div>
            <Heading />
            <RenderPage />
            <div className="buttons">
                <button className="thisbutton" id="0" onClick={clickhandler}>Login</button>
                <button className="thisbutton" id="1" onClick={clickhandler}>Register</button>
            </div>
        </div>
    )
}