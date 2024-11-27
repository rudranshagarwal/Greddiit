import './Reported.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import NewNav from './NewNav'
import App from '../App'

export default function Reported() {
    const { name } = useParams()
    const [reports, setreports] = useState([])
    const [ignoreother, setignoreother] = useState(0)
    const [cancelling, setcancel] = useState(3)
    const [displayblock, setdisplayblock] = useState(0)
    const [interval, setinterval] = useState(0)
    const [blockuser, setblockuser] = useState("")
    const [blocked, setblocked] = useState([])
    document.body.style.backgroundColor = "rgb(188, 47, 47)"
    let counter = cancelling
    if (counter <= 0 && displayblock) {
        console.log("sending request")
        console.log(blocked)
        setdisplayblock(0)
        setcancel(3)
        clearInterval(interval)
        console.log(blockuser)
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/block', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                block: blockuser,
                name: name
            }
        }).then(res => {
            setblocked([...blocked, blockuser]); setblockuser("")
        })
    }
    useEffect(() => {
        const token = localStorage.getItem('token')
        axios.get('https://greddiit-backend-l5kk.onrender.com/api/getreports', {
            headers: {
                Authorization: `Bearer ${token}`
            }
            ,
            params: {
                name: name
            }
        }).then(res => {
            setreports(res.data.reports)
            setblocked(res.data.blocked)

        }).catch(error =>
            console.log(error))
    }, [])

    function ignore() {
        const token = localStorage.getItem('token')
        setignoreother(!ignoreother)
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/reportignore', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(res => console.log(res.data)).catch(error => console.log(error))
    }

    function block(currreport,event) {
        setdisplayblock(1)
        setinterval(setInterval(check, 1000))
        function check() {

            setcancel(counter => counter - 1)
        }
        console.log(currreport)
        setblockuser(currreport.reportuser)
    }
    function canceller() {
        setdisplayblock(0)
        setcancel(3)
        clearInterval(interval)
        setblockuser("")

    }

    function deletepost(post, event) {
        const token = localStorage.getItem('token')
        axios.post('https://greddiit-backend-l5kk.onrender.com/api/deletepost', {
            headers: {
                Authorization: `Bearer ${token}`
            }, params: {
                name: name,
                post: post
            }
        }).then(res => {
            setreports(reports.filter(currpost => post.id != currpost.id))
        }).catch(error => console.log(error.message))
    }

    function Displayreport(props) {
        const { currreport } = props
        let blockbutton, deletebutton;
        if (ignoreother) {

            if (blocked.includes(currreport.reportuser))
                blockbutton = <button onClick={block.bind(this, currreport)} className="blockreport" disabled style={{ color: "grey" }} disable>Blocked</button>

            else
                blockbutton = <button onClick={block.bind(this, currreport)} className="blockreport" disabled style={{ color: "grey" }}>Block</button>
            deletebutton = <button onClick={deletepost.bind(this,currreport)} className="deletepost" disabled>Delete Post</button>
        }
        else {
            if (blocked.includes(currreport.reportuser))
                blockbutton = <button onClick={block.bind(this, currreport)} className="blockreport" disabled style={{ color: "grey" }} disable>Blocked</button>
            else if (displayblock)
                blockbutton = <button onClick={canceller} className="blockreport">Cancel in {cancelling} s</button>
            else
                blockbutton = <button onClick={block.bind(this, currreport)} className="blockreport">Block</button>
            deletebutton = <button onClick={deletepost.bind(this,currreport)} className="deletepost">Delete Post</button>
        }

        return (
            <div className="reporteach">
                <div className="reportdetails">
                    <p>Reported By: {currreport.reportedby}</p>
                    <p>Report against: {currreport.reportuser}</p>
                    <p>Reported post: {currreport.description}</p>
                    <p>Concern: {currreport.concern}</p>
                </div>
                <div className="reportactions">
                    <button onClick={ignore} className="ignorereport">Ignore</button>
                    {blockbutton}
                    {deletebutton}

                </div>
            </div>)
    }
    let reportsdisplay
    if (reports) {
        reportsdisplay = reports.map(currreport => {
            currreport.blocked = false
            return <Displayreport currreport={currreport} />
        })
    }
    return (
        <div>
            <NewNav name={name} />
            <div className="bodyofreports">
                {reportsdisplay}
            </div>
        </div>
    )
}