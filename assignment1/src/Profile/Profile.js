import React from 'react'
import { userState } from 'react'
import './Profile.css'
import Details from './Details'
import Navbar from './Navbar'
import Followers from './Followers'

export default function Profile(props) {
    const { username } = props
    // document.getElementsByTagName("div").blur();
    return (
        <div>
            <Navbar />
            <div>
                <Details username={username} />
                <Followers visibility="hidden"/>
            </div>

        </div>
    )
}