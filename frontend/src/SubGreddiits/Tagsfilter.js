import './Tagfilter.css'
import { useState } from 'react'

export default function Tagsfilter(props) {
    const { subgreddiits, setsubgreddiits, displaysubgreddiits, setdisplaysubgreddiits } = props
    const [tags, settags] = useState([])
    const [searchtag, setsearchtag] = useState("")
    const [tagschange, settagschange] = useState(false)
    if (tagschange) {
        settagschange(false)
        if (tags.length) {
            let temp = displaysubgreddiits.filter(value => {
                if (value.tags.some(value2 => {
                    console.log(value2)
                    return tags.includes(value2)
                }
                ))
                    return 1
                else
                    return 0


            })
            setdisplaysubgreddiits(temp)
        }
        else
        setdisplaysubgreddiits(subgreddiits)


    }
    function handleChange(event) {
        setsearchtag(event.target.value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        let newarray = [...tags, searchtag]
        newarray = [...new Set(newarray)]
        settags(newarray)
        settagschange(true)
        setsearchtag("")
    }

    function deletetag(event) {
        event.preventDefault()
        let newarray = [...tags]
        newarray = newarray.filter(value => value !== event.target.id)
        settags(newarray)
        settagschange(true)

    }
    const display = tags.map((value) => {
        return (<div className="Tag">
            <p>{value}</p>
            <button onClick={deletetag}><img id={value} className="removetag" src="https://img.icons8.com/color/48/null/delete-sign--v1.png" /></button>
        </div>)
    })
    return (
        <div className="Tags">
            <form className="tags" onSubmit={handleSubmit} >
                <input type="text" placeholder="Tags.." name="search" value={searchtag} onChange={handleChange} />
                <button type="submit" ><i className="fa fa-search"></i></button>
            </form>
            <div className="listoftags">
                {display}
            </div>
        </div>
    )
}