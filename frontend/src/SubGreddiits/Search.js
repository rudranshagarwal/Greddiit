import './Search.css'
import { useState } from 'react'
import Fuse from 'fuse.js'
import { display } from '@mui/system'

export default function Search(props) {

    const {subgreddiits, setsubgreddiits, displaysubgreddiits, setdisplaysubgreddiits} = props
    const [search, setsearch] = useState("")

    function handleChange(event) {
        setsearch(event.target.value)


    }
    
    function handleSubmit(event){
        event.preventDefault()
        const searching = search

        const fuse = new Fuse(subgreddiits, {
            keys: ['name']
        })

        let temp = fuse.search(searching) 
        console.log(temp)
        setdisplaysubgreddiits(temp.map(value => value.item))
        setsearch("")
    }

    return (
        <div className="Search">
            <form className="example" onSubmit={handleSubmit} >
                <input type="text" placeholder="Search.." name="search" value={search} onChange={handleChange}/>
                    <button type="submit" ><i className="fa fa-search"></i></button>
            </form>        
        </div>
    )
}