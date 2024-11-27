import react from 'react'
import './Edit.css'
import { useState } from 'react'
import axios from 'axios'

export default function Edit(props) {
    const { details, setDetails ,didedit, setdidedit} = props
    const [change, setChange] = useState("")
    const [edit, setEdit] = useState("")
    let value = 0
    function handleSelect(event) {
        event.preventDefault();

        setChange(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (value === 1) {
            setChange("")
            setEdit("")
        }
        else {
            const token = localStorage.getItem('token')
            axios.post('http://localhost:3001/api/profile/edit', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: {
                    edit: change,
                    changeto: edit
                }
            }).then(response => setDetails({ ...details, [change]: edit })).catch(error => console.log(error.message))
            setChange("")
            setEdit("")
            setdidedit(true)
        }
    }
    function changeHandler(event) {
        event.preventDefault();
        setEdit(event.target.value)
        console.log(edit)
    }

    return (
        <div>
            <div className="Edit">

                <select onClick={handleSelect}>
                    <option selected disabled hidden value="EditPofile">Edit Profile</option>
                    <option value="firstname" >Firstname</option>
                    <option value="lastname" >Lastname</option>
                    <option value="email" >Email</option>
                    <option value="contact">Contact</option>
                    <option value="age" >Age</option>

                </select>

            </div>
            {change && (
                <form onSubmit={handleSubmit} className="edit-form">
                    <input placeholder={`New ${change}`} type="text" value={edit} onChange={changeHandler}></input>
                    <button className="button" type="submit" value ="Submit" onClick={()=>value=0}>Submit</button>
                    <button className="button" type="submit" value="Cancel" onClick={()=>value = 1}>Cancel</button>
                </form>
            )}
        </div>
    )
}