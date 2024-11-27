import Navbar from '../Navbar'
import Subdisplay from './Subdisplay'
import './MySubGreddiits.css'
import NewSubGreddiit from './NewSubGreddiit'
import axios from 'axios'
import { useEffect, useState } from 'react'


export default function MySubGreddiits() {
    const [mysubgreddiits, setmysubgreddiits] = useState([])
    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get('/api/getMySubGreddiits', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            console.log(response.data)
            setmysubgreddiits(response.data)
        })
            .catch(error => console.log(error.message))

    }, [])
    const display = mysubgreddiits.map(details => {return <Subdisplay details={details} mysubgreddiits={mysubgreddiits} setmysubgreddiits={setmysubgreddiits} />} )
    document.body.style.backgroundColor = "rgb(63, 170, 246)";
    return (
        <div>
            <Navbar />
            <NewSubGreddiit mysubgreddiits={mysubgreddiits} setmysubgreddiits={setmysubgreddiits}/>

            <div className="mysubs">
                {display}
            </div>
        </div>
    )
}