import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import RaisedButton from 'material-ui/RaisedButton'
import firebase from 'firebase'
import AvatarCropper from "react-avatar-cropper"
import TextField from 'material-ui/TextField'


export default class IconSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      url: '',
      uri: '',
      name: '',
      cropperOpen: false,
      showPicture: false
    }
  }

   componentWillMount () {
   var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId + '/info').on('value', function(snapshot) {
      this.setState({name: snapshot.val().name})
    }.bind(this));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId + '/info' ).update({img:this.state.url}).then(()=>alert("Change picture Success!"))
  }


  onDrop = (file) => {
      this.setState({
        files: this.state.files.push(file)
      });
     this.setState({
      url: this.state.files[0][0].preview,
      cropperOpen: true
     })
  }

  handleRequestHide = () => {
    this.setState({
      cropperOpen: false,
      showPicture: true
    });
  }

  handleCrop = (dataURI) => {
    this.setState({
      cropperOpen: false,
      files: [],
      url: dataURI
    });
  }

  handleChangeName = (e) => {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('users/' + userId + '/info' ).update({name:this.state.name}).then(()=>alert("Change ID Success!"))
  }
  render () {
    return (
      <div>
      <h1>Upload your profolio picture!</h1>
      <div>
        <h4> Reset your name : </h4>
          <TextField       
            hintText={"Your current name: " + this.state.name}
            onChange={(e,value) => this.setState({name: e.target.value})}/>
          <br/>
          <RaisedButton style={{align: "center"}}type="submit" label="Submit" primary={true}
            onMouseDown={this.handleChangeName}/> 
        </div>
      <div style={{display:"flex"}}>
        <form onSubmit={this.handleSubmit}>
        <div>
          <Dropzone onDrop={this.onDrop} >
            <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <RaisedButton style={{align: "center"}}type="submit" label="Submit" primary={true} /> 
        </div>
      </form>
       {this.state.files ? 
        <div>
        <AvatarCropper
          onRequestHide={this.handleRequestHide}
          cropperOpen={this.state.cropperOpen}
          onCrop={this.handleCrop}
          image={this.state.url}
          width={400}
          height={400}
        />
        {this.state.cropperOpen ? null : <img src={this.state.url} style={{paddingLeft: 80}} role="presentation"/>} </div>: null}
      </div>
      </div>
    )
  }
}