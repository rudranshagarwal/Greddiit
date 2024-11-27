import Profile from './Profile/Profile'
import Page from './LoginRegister/LoginRegister';
import { Route, Routes } from 'react-router-dom';
import MySubGreddiits from './MySubGreddiits/MySubGreddiits'
import SubGreddiits from './SubGreddiits/SubGreddiits'
import OnClickSubGreddiit from './MySubGreddiits/OnClickSubGreddiit';
import Users from './MySubGreddiits/Users'
import JoinRequests from './MySubGreddiits/JoinRequests';
import Posts from './SubGreddiits/Posts'
import Reported from './MySubGreddiits/Reported'
import Savedposts from './Savedposts/Savedposts';
import Stats from './MySubGreddiits/Stats'
import { useNavigate,Navigate } from 'react-router-dom'

import { useState } from 'react'

export default function App() {
    const navigate = useNavigate()
    let iskeydown = {
        'p': false,
        's': false,
        'm': false,
        'g': false,
        'Control': false
    }
    document.onkeydown = (event) => {
        iskeydown[event.key] = true;
        if (iskeydown['Control'] && iskeydown['p']) {
            event.preventDefault()
            navigate('/Profile')
        }
        if (iskeydown['Control'] && iskeydown['s']) {
            event.preventDefault()
            navigate('/Savedposts')
        }
        if (iskeydown['Control'] && iskeydown['m']) {
            event.preventDefault()
            navigate('/MySubGreddiits')
        }
        if (iskeydown['Control'] && iskeydown['g']) {
            event.preventDefault()
            navigate('/SubGreddiits')
        }
    }

    document.onkeyup = (event) => {
        iskeydown[event.key] = false;
    }

    function Protected(props) {

        const { children } = props
        if (!localStorage.getItem('token'))
            return <Navigate to="/" replace />
        return children
    }

    function Loggedin(props) {

        const { children } = props
        if (localStorage.getItem('token'))
        {
            alert("You can't go back to login page")
            return <Navigate to="/profile" replace />
        }
        return children
    }

    function Checklogin(props) {

        const {Page, Login} = props
        if(localStorage.getItem('token'))
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
    // return (
    //     <Routes>
    //         <Route path="/" element={<Page />} />
    //         <Route path="/Login" element={<Page />} />
    //         <Route path="/Profile" element={<Protected children={Profile}>
    //             <Profile />
    //         </Protected>
    //         } />
    //         <Route path="/MySubGreddiits" element={<Checklogin Page={MySubGreddiits} Login={Page} />} />
    //         <Route path="/SubGreddiits" element={<Checklogin Page={SubGreddiits} Login={Page} />} />
    //         <Route path="/SubGreddiitPage/:name" element={<Checklogin Page={OnClickSubGreddiit} Login={Page} />} />
    //         <Route path="/MySubGreddiitPage/Users/:name" element={<Checklogin Page={Users} Login={Page} />} />
    //         <Route path="/MySubGreddiitPage/JoinRequests/:name" element={<Checklogin Page={JoinRequests} Login={Page} />} />
    //         <Route path="/SubGreddiits/Posts/:name" element={<Checklogin Page={Posts} Login={Page} />} />
    //         <Route path="/MySubGreddiitPage/Reported/:name" element={<Checklogin Page={Reported} Login={Page} />} />
    //         <Route path="/Savedposts" element={<Checklogin Page={Savedposts} Login={Page} />} />
    //     </Routes>
    // )
    return (
        <Routes>
            <Route path="/" element={<Loggedin>
                <Page />
            </Loggedin>
            } />
            <Route path="/Login" element={<Loggedin>
                <Page />
            </Loggedin>
            } />
            <Route path="/Profile" element={<Protected>
                <Profile />
            </Protected>
            } />
            <Route path="/MySubGreddiits" element={<Protected>
                <MySubGreddiits />
                </Protected>
            } />
            <Route path="/SubGreddiits" element={<Protected>
                <SubGreddiits />
                </Protected>
            }  />
            <Route path="/SubGreddiitPage/:name" element={<Protected>
                <OnClickSubGreddiit />
                </Protected>
            } />
            <Route path="/MySubGreddiitPage/Users/:name" element={<Protected>
                <Users />
                </Protected>
            } />
            <Route path="/MySubGreddiitPage/JoinRequests/:name" element={<Protected>
                <JoinRequests />
                </Protected>
            } />
            <Route path="/SubGreddiits/Posts/:name" element={<Protected>
                <Posts />
                </Protected>
            } />
            <Route path="/MySubGreddiitPage/Reported/:name" element={<Protected>
                <Reported />
                </Protected>
            } />
            <Route path="/Savedposts" element={<Protected>
                <Savedposts />
                </Protected>
            } />
            <Route path="/Stats/:name" element={<Protected>
                <Stats />
                </Protected>
            } />
        </Routes>
    )
}