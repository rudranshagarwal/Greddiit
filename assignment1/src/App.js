import Profile from './Profile/Profile'
import Page from './LoginRegister/LoginRegister';
import {Route, Routes} from 'react-router-dom';
import {useState} from 'react'

export default function App() {

    const [isloggedin, setisloggedin] = useState(localStorage.getItem("loggedin"))

    function Checklogin(props) {

        const {Page, Login} = props
        if(localStorage.getItem("loggedin") === "1")
            return <Page />
         else
         {
            console.log("Hi")

            return (
                <div>
                    <h1 style={{color: "red", marginLeft: "42%"}}>!!Login First!!</h1>
                    <Login />            
                </div>
            )
        }
    }
    console.log()
    return (
        <Routes>
            <Route path="/" element = {localStorage.getItem("loggedin") === "1"? <Profile /> : <Page login={isloggedin}/>} />
            <Route path="/Login" element={<Page />} />
            <Route path="/Profile" element={<Checklogin Page={Profile} Login={Page} /> }  />

        </Routes>
    )
}