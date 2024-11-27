import React from 'react'
import './Profile.css'
import Details from './Details'
import Navbar from '../Navbar'
import Followers from './Followers'

export default function Profile() {
    // document.getElementsByTagName("div").blur();
    return (
        <div>
            <Navbar />
            <div>
                <Details />
                <Followers visibility="hidden"/>
            </div>

        </div>
    )
}