import axios from 'axios'
import './Subdisplay.css'
import {useNavigate} from 'react-router-dom'


export default function Subdisplay(props) {

    const navigate = useNavigate()
    const { details,mysubgreddiits, setmysubgreddiits } = props
    let deletegreddiit = 0
    function deletesubgreddiit(name,event) {
        console.log("at delete")
        deletegreddiit = 1
        const token = localStorage.getItem('token')
        const data={
            name: name
        }
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/mysubgreddiit/deletesub', {
            headers : {
                Authorization: `Bearer ${token}`
            },
            data
        }).then(response => {
            let newgreddiits = mysubgreddiits.filter(sub => sub.name != name)
            console.log('delete', newgreddiits)
            setmysubgreddiits(newgreddiits)
        }).catch(error =>console.log(error.message))
    }
    return (
        <div onClick={()=> {if(!deletegreddiit)
            navigate(`/SubGreddiitPage/${details.name}`)
        }} className="subdisplay">
            <div className="subphoto">
                <img src="https://img.icons8.com/ios-filled/50/null/groups.png" />
            </div>
            <div className="subtext">
                <p>Name: {details.name}</p>
                <p>Description: {details.description}</p>
                
                
                <p>Banned Words: {details.bannedkeywords.join(",")}</p>
                
                <p>Followers: {details.followers.length}</p>
                <p>posts: {details.posts.length}</p>
                <a onClick={deletesubgreddiit.bind(this, details.name)}><img className="delete" src="https://img.icons8.com/material/24/null/delete--v1.png" /></a>

            </div>
        </div>
    )
}