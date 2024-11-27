import './Register.css';
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [userDetails, setUserDetails] = useState({
    FirstName: "",
    LastName: "",
    UserName: "",
    Email: "",
    Age: "",
    Contact: "",
    Password: ""
  })

  async function handleSubmit(event) {
    event.preventDefault();
    let details = {}
    details.firstname = event.target[0].value
    details.lastname = event.target[1].value
    details.username = event.target[2].value
    details.email = event.target[3].value
    details.age = event.target[4].value
    details.contact = event.target[5].value
    details.password = event.target[6].value
    try {
      console.log(details)
      const response = await axios.post('localhost:3001/api/Register', { details })

      console.log(response.data.token)
      localStorage.setItem('token', response.data.token)
      navigate('/Profile')
    }
    catch (error) {
      console.log("Here")
      navigate('/')
      console.log(error.response.data)
    }
    // localStorage.setItem("username") = 
  }

  const changeHandler = (event) => {
    const { placeholder, value } = event.target
    const tempUserObject = {
      ...userDetails,
      [placeholder]: value
    }
    console.log(event.target)
    setUserDetails(tempUserObject);
    console.log('tempObject:', tempUserObject)
    console.log(userDetails)
  }

  function validate() {
    var validmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var validphone = /^[6-9]\d{9}$/
    if (userDetails.Email?.match(validmailRegex) && userDetails.Contact?.match(validphone) && userDetails.FirstName && userDetails.LastName && userDetails.UserName
    && userDetails.Password && Math.sign(userDetails.Age) > 0) 

    

      return false;
     else {
       console.log("Here")
          return true;
    }
  }
  return (
    <div>
      <form className="register-form" onSubmit={handleSubmit}>
        <input placeholder="FirstName" name="FirstName" type="text" value={userDetails.FirstName} onChange={changeHandler}></input>
        <input placeholder="LastName" type="text" value={userDetails.LastName} onChange={changeHandler}></input>
        <input placeholder="UserName" type="text" value={userDetails.UserName} onChange={changeHandler}></input>
        <input placeholder="Email" type="text" value={userDetails.Email} onChange={changeHandler}></input>
        <input placeholder="Age" type="text" value={userDetails.Age} onChange={changeHandler}></input>
        <input placeholder="Contact" type="text" value={userDetails.Contact} onChange={changeHandler}></input>
        <input placeholder="Password" type="password" value={userDetails.Password} onChange={changeHandler}></input>
        <input type="submit" disabled={validate()}></input>

      </form>
    </div>
  );
}

export default Register;
