import './NewNav.css'
import react from 'react'
import Logout from '../Logout'
import { useNavigate } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RedditIcon from '@mui/icons-material/Reddit';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import GroupIcon from '@mui/icons-material/Group';
import ReportIcon from '@mui/icons-material/Report';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AnalyticsIcon from '@mui/icons-material/Analytics';

export default function NewNav(props) {
    const { name } = props
    const navigate = useNavigate()
    return (
        <div className="NavonSubGreddiit">
            <h1>Greddiit</h1>
            <nav>
            <button className="Navprofile" onClick={()=>navigate('/Profile')}><AccountCircleIcon sx={{fontSize: 45}}/></button>
                <button className="Navmysubgreddiits" onClick={() => navigate('/MySubGreddiits')}><RedditIcon sx={{ fontSize: 45 }} /></button>
                <button className="Navsubgreddiits" onClick={() => navigate('/SubGreddiits')}><RedditIcon  sx={{ fontSize: 45 }} /></button>
                <button className="Navsavedposts" onClick={() => navigate('/Savedposts')}><BookmarkIcon sx={{ fontSize: 45 }} /></button>
                <button className="NavUsers" onClick={() => navigate(`/MySubGreddiitPage/Users/${name}`)}><GroupIcon sx={{ fontSize: 45 }} /></button>
                <button className="NavReported" onClick={() => navigate(`/MySubGreddiitPage/Reported/${name}`)}><ReportIcon sx={{ fontSize: 45 }} /></button>
                <button className="NavJoinRequests" onClick={() => navigate(`/MySubGreddiitPage/JoinRequests/${name}`)}><GroupAddIcon sx={{ fontSize: 45 }} /></button>
                <button className="NavStats" onClick={() => navigate(`/Stats/${name}`)}><AnalyticsIcon sx={{ fontSize: 45 }} /></button>

                <Logout />
            </nav>
        </div>
    )
}