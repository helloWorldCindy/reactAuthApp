import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import RaisedButton from 'material-ui/RaisedButton'
import firebase from 'firebase'
import AvatarCropper from "react-avatar-cropper";


export default class IconSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      url: '',
      uri: '',
      cropperOpen: false,
      showPicture: false
    }
  }

  handleSubmit = (e) => {
    var userId = firebase.auth().currentUser.uid;
    console.log(this.state.files)
    firebase.database().ref('users/' + userId + '/info/img' ).push(this.state.url).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
    });
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

  render () {
    return (
      <div>
      <h1>Upload your profolio picture!</h1>
      <div style={{display:"flex"}}>
        <form onSubmit={this.handleSubmit}>
        <Dropzone onDrop={this.onDrop} >
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
        <br/>
        <RaisedButton style={{align: "center"}}type="submit" label="Submit" primary={true} /> 
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