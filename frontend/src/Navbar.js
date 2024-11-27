import React from 'react'
import './Navbar.css'
import {useNavigate} from 'react-router-dom'
import Logout from './Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RedditIcon from '@mui/icons-material/Reddit';
import BookmarkIcon from '@mui/icons-material/Bookmark';

export default function Navbar() {

    const navigate = useNavigate()
    return (
        <div className="completenav">
            <h1>Greddiit</h1>

            <nav>
            <button className="navprofile" onClick={()=>navigate('/Profile')}><AccountCircleIcon sx={{fontSize: 45}}/></button>
            <button className="navmysubgreddiits" onClick={()=>navigate('/MySubGreddiits')}><RedditIcon sx={{fontSize: 45}}/></button>
            <button className="navsubgreddiits" onClick={()=>navigate('/SubGreddiits')}><RedditIcon  color="action" sx={{fontSize: 45}} /></button>
            <button className="navsavedposts" onClick={() => navigate('/Savedposts')}><BookmarkIcon sx={{fontSize: 45}}/></button>
                <Logout />
            </nav>
        </div>
    )
}