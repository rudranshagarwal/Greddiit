import React from 'react'
import './Navbar.css'
import Logout from '../Logout'

export default function Navbar() {
    return (
        <div>
            <nav>
                <h1>Greddiit</h1>
                <h1></h1>
                <Logout />
            </nav>
        </div>
    )
}