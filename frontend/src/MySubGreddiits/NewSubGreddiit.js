import react from 'react'
import './NewSubGreddiit.css'
import Popup from 'reactjs-popup'
import { useState } from 'react'
import axios from 'axios'

export default function NewSubGreddiit(props) {
    const {mysubgreddiits, setmysubgreddiits} = props
    const [SubGreddiitdetails, setSubGreddiitdetails] = useState({
        Name: "",
        Description: "",
        Tags: "",
        BannedKeywords: "",
        Date: {}
    })
    function changeHandler(event) {

        const { placeholder, value } = event.target
        const tempUserObject = {
            ...SubGreddiitdetails,
            [placeholder]: value
        }
        console.log(event.target)
        setSubGreddiitdetails(tempUserObject);
    }

    function handleSubmit(event) {
        event.preventDefault()
        const date = new Date()
        console.log(date)
        let subgreddiitdetails = {
            name: event.target[0].value,
            description: event.target[1].value,
            tags: event.target[2].value.toLowerCase().split(','),
            bannedkeywords: event.target[3].value.split(','),
            date: date
        }
        if(!subgreddiitdetails.name)
            return
        const token = localStorage.getItem('token')
        axios.post('http://localhost:3001/api/MySubGreddiits/NewSubGreddiit', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            subgreddiitdetails
        }).then(response => {
            console.log(response.data)
            let newsubs = mysubgreddiits.map(details => details)
            newsubs.push(response.data)
            setmysubgreddiits(newsubs)
        }).catch(error => console.log(error.message))
        console.log(subgreddiitdetails)
        setSubGreddiitdetails({
            Name: "",
            Description: "",
            Tags: "",
            BannedKeywords: "",
            Date: {}
        })
    }



    return (
        <div className="CreateSubGreddiit">
            <img src="https://img.icons8.com/plasticine/100/null/plus-math.png" />
            <Popup trigger={<button className="CreateSubGreddiitbutton">Create New SubGreddiit</button>}>
                <div className="SubGreddiitpopup">
                    <form className="NewSubGreddiit-form" onSubmit={handleSubmit}>
                        <input placeholder="Name" name="Name" type="text" value={SubGreddiitdetails.Name} onChange={changeHandler}></input>
                        <input placeholder="Description" type="text" value={SubGreddiitdetails.Description} onChange={changeHandler}></input>
                        <input placeholder="Tags" type="text" value={SubGreddiitdetails.Tags} onChange={changeHandler}></input>
                        <input placeholder="BannedKeywords" type="text" value={SubGreddiitdetails.BannedKeywords} onChange={changeHandler}></input>

                        <input type="submit"></input>
                    </form>
                </div>
            </Popup>

        </div>
    )
}