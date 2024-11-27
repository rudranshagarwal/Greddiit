import SubGreddiitsdisplay from './SubGreddiitsdisplay'
import './SubGreddiits.css'
import Navbar from '../Navbar'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Sort from './Sort'
import Search from './Search'
import Tagsfilter from './Tagsfilter'


export default function SubGreddiits() {
    const [subgreddiits, setsubgreddiits] = useState([])
    const [displaysubgreddiits, setdisplaysubgreddiits] = useState([])
    let [user, setuser] = useState("")
    const [sort, setsort] = useState([])
    console.log("rerender")
    console.log(subgreddiits)
    useEffect(() => {

        const token = localStorage.getItem('token')
        axios.get('https://greddiit-backend-l5kk.onrender.com/api/getSubGreddiits', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            setuser(response.data.user)
            setdisplaysubgreddiits(response.data.array)
            setsubgreddiits(response.data.array)
        })
            .catch(error => console.log(error.message))
        setsort(["sortstart"])

    }, [])

    const sorts = {
        "sortstart": sortstart,
        "Name:Asc": sortNameAscending,
        "Name:Des": sortNameDescending,
        "Followers": sortFollowers,
        "CreationTime": sortTime
    }

    function sortNameAscending(x, y) {
        if (x.name < y.name)
            return -1
        else if ((sort.findIndex((value) => value === "Name:Asc") != sort.length - 1) && x.name === y.name) {
            return sorts[sort[sort.findIndex((value) => value === "Name:Asc") + 1]](x, y)
        }
        else
            return 1
    }
    function sortNameDescending(x, y) {
        if (x.name < y.name) {
            return 1
        }
        else if ((sort.findIndex((value) => value === "Name:Des") != sort.length - 1) && x.name === y.name) {
            return sorts[sort[sort.findIndex((value) => value === "Name:Des") + 1]](x, y)
        }
        else {

            return -1

        }
    }
    function sortFollowers(x, y) {

        if (x.followers.length < y.followers.length)
            return 1;
        else if ((sort.findIndex((value) => value === "Followers") != sort.length - 1) && x.followers.length === y.followers.length) {
            return sorts[sort[sort.findIndex((value) => value === "Followers") + 1]](x, y)
        }
        else
            return -1;
    }
    function sortTime(x, y) {
        if (x.date > y.date)
            return -1
        else if ((sort.findIndex((value) => value === "CreationTime") != sort.length - 1) && x.date === y.date) {
            return sorts[sort[sort.findIndex((value) => value === "CreationTime") + 1]](x, y)
        }
        else
            return 1
    }


    function sortstart(x, y) {
        if (x.followers.includes(user) && !y.followers.includes(user))
            return -1;
        else if ((sort.findIndex((value) => value === "sortstart") != sort.length - 1) && x.followers.includes(user) === y.followers.includes(user)) {
            return sorts[sort[sort.findIndex((value) => value === "sortstart") + 1]](x, y)
        }
        else
            return 1;
    }

    displaysubgreddiits.sort(sortstart)


    const display = displaysubgreddiits.map(details => { return <SubGreddiitsdisplay details={details} subgreddiits={subgreddiits} setsubgreddiits={setsubgreddiits} user={user} /> })

    document.body.style.backgroundColor = "green";
    return (
        <div>

            <Navbar />

            <Sort sort={sort} setsort={setsort} />
            <div className="filtering">
                <Search subgreddiits={subgreddiits} setsubgreddiits={setsubgreddiits} displaysubgreddiits={displaysubgreddiits} setdisplaysubgreddiits={setdisplaysubgreddiits} />
                <Tagsfilter subgreddiits={subgreddiits} setsubgreddiits={setsubgreddiits} displaysubgreddiits={displaysubgreddiits} setdisplaysubgreddiits={setdisplaysubgreddiits} />
            </div>
            <div className="subgreddiitspage">
                {display}
            </div>
        </div>
    )
}