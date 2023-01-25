import './Register.css';
import {useState} from 'react'

function Register() {

  const [userDetails, setUserDetails] = useState({
    FirstName : "",
    LastName: "",
    UserName: "",
    Email: "",
    Age: "",
    Contact: "",
    Password: ""
  })

  const changeHandler = (event) =>
  {
    const {placeholder, value} = event.target
    const tempUserObject = {
      ...userDetails,
      [placeholder]: value
    }
    console.log(event.target)
    setUserDetails(tempUserObject);
    console.log('tempObject:', tempUserObject)
    console.log(userDetails)
  }
  return (
    <div>
      <form className="register-form">
        <input placeholder="FirstName"  name="FirstName"type="text" value ={userDetails.FirstName} onChange = {changeHandler}></input>
        <input placeholder="LastName"   type="text" value ={userDetails.LastName} onChange = {changeHandler}></input>
        <input placeholder="UserName"   type="text" value ={userDetails.UserName} onChange = {changeHandler}></input>
        <input placeholder="Email"      type="text" value ={userDetails.Email} onChange = {changeHandler}></input>
        <input placeholder="Age"        type="text" value ={userDetails.Age} onChange = {changeHandler}></input>
        <input placeholder="Contact"    type="text" value ={userDetails.Contact} onChange = {changeHandler}></input>
        <input placeholder="Password"   type="password" value ={userDetails.Password} onChange = {changeHandler}></input>
        <input type="submit"></input>

      </form>
    </div>
  );
}

export default Register;
