import './Sort.css'
import Select from 'react-select'
import {useState} from 'react'

export default function Sort(props) {

    const { sort, setsort } = props
    function handleSelect(event) {
        console.log(event)
        // if (event.target.value === "Sort")
        //     return
        // if (event.target.value === "None")
        //     setsort(["sortstart"])
        // else
        //     setsort(["sortstart", event.target.value])
        setsort(event.map(value => value.label))
    }

    const [options,setoptions] = useState([ {
        "value": "Name:Asc",
        "label": "Name:Asc"
    }, {
        "value": "Name:Des",
        "label": "Name:Des"
    }, {
        "value": "Followers",
        "label": "Followers"
    }, {
        "value": "CreationTime",
        "label": "CreationTime"
    }
    ])
    console.log(sort, options)
    return (
        <div className="Sort">

            <Select
                isMulti={true} options={options} closeMenuOnSelect={false} onChange={handleSelect} placeholder="sort"/>



        </div>
    )
} 