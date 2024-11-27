import './OnClickSubGreddiit.css'
import { useParams, useNavigate } from 'react-router-dom'
import Logout from '../Logout'
import NewNav from './NewNav'

export default function OnClickSubGreddiit() {
    const { name } = useParams()
    const navigate = useNavigate()

    document.body.style.background = "  rgb(31, 56, 216)"
    return (
        <div>
            <NewNav name={name} />

        </div>
    )
}