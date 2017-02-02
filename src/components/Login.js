import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { firebaseAuth } from '../config/constants'
import { signInGoogle, signInFacebook } from '../helpers/auth'

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: ''
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    firebaseAuth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
      if(error.code === "auth/wrong-password"){
        this.setState({errorMessage: "Invalid User or Password"})
      }
    })
  }
  render () {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1> Login </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <TextField       
                  hintText="Enter your email"
                  floatingLabelText="EMAIL" 
                  onChange={(e,value) => this.setState({email: e.target.value})}
                  errorText={this.state.errorMessage !== "" ? this.state.errorMessage : null}/>
          </div>
          <div className="form-group">
            <TextField       
                  hintText="Enter your password"
                  floatingLabelText="PASSWORD"
                  type="password" 
                  onChange={(e,value) => this.setState({password: e.target.value})}
                  errorText={this.state.errorMessage !== "" ? this.state.errorMessage : null}/>
          </div>
          <RaisedButton type="submit" label="Submit" primary={true}/>
          <p> Dont have an account? <a href='/register'>Click here to register!</a></p> 
          <p> Or you can login with :</p>
          <RaisedButton label="Google" primary={true} onMouseDown={(e)=>{
            signInGoogle()
          }}/>
          <RaisedButton label="Facebook" style={{marginLeft: 10}}primary={true} onMouseDown={(e)=>{
            signInFacebook()
          }}/>
        </form>
          
      </div>
    )
  }
}