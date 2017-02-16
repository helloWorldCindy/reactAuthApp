import React, { Component } from 'react'
import { ref, firebaseAuth } from '../config/constants'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : "",
      password: "",
      email: "",
      emName: false,
      emEmail: false,
      emPw: false,
      errorMessageEmail: "",
      errorMessagePw: ""
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    if(this.state.name === '')
    {
      this.setState({emName: true})
    }
    if(this.state.email === '')
    {
      this.setState({emEmail: true})
    }
    if(this.state.password === '')
    {
      this.setState({emPw: true})
    }
    if(this.state.name !== '' && !this.state.password !== ''){
      firebaseAuth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{
        ref.child(`users/${user.uid}/info`).set({
        email: user.email,
        name: this.state.name,
        uid: user.uid,
        img: 'http://lentech.org/images/no_avatar.png',
        follower: 0,
        following: 0,
        description: "There is no description",
        count: 0
      });
    })
    .catch((error) => {
      console.log(error.code)
      console.log(error.message)
      if(error.code === "auth/invalid-email"){
        this.setState({errorMessageEmail: "email adress invalid"})
      }
      if(error.code === "auth/weak-password"){
        this.setState({errorMessagePw: "Password should be at least 6 characters"})
      }
      if(error.code === "auth/email-already-in-use"){
        this.setState({errorMessageEmail: "The email address is already in use by another account."})
      }
    })
    }
  }
  render () {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
                <TextField       
                  hintText="Enter your ID"
                  floatingLabelText="USER ID"
                  onChange={(e,value) => {
                    this.setState({name: e.target.value})
                    if(e.target.value !== ""){
                      this.setState({emName: false})}
                    }
                  }
                  errorText={this.state.emName ? "This Field is required!" : null}/>
                <br/>
                <TextField       
                  hintText="Enter your email"
                  floatingLabelText="EMAIL" 
                  onChange={(e,value) => {
                    this.setState({email: e.target.value})
                    if(e.target.value !== ""){
                      this.setState({emEmail: false})}
                    }
                  }
                  errorText={this.state.errorMessageEmail ? this.state.errorMessageEmail : null}/>
                  <br/>
                <TextField       
                  hintText="Enter your password"
                  floatingLabelText="PASSWORD"
                  type="password" 
                  onChange={(e,value) => {
                    this.setState({password: e.target.value})
                    if(e.target.value !== ""){
                      this.setState({emPw: false})}
                    }
                  }
                  errorText={this.state.errorMessagePw ? this.state.errorMessagePw : null}/>
                  <br/>
          </div>
          <RaisedButton type="submit" label="Submit" primary={true}/>
        </form>
      </div>
    )
  }
}