import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'
import FontIcon from 'material-ui/FontIcon'
import Dropzone from 'react-dropzone'
import update from 'immutability-helper'
import ReactRpg from '../../helpers/react-rpg'
import Tags from './Tags'

export default class CreateContext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      files: [],
      url: []
    }
  }
  //open edit area
  handleOpen = (e) => {
    this.setState({editing: true})
  }
  //close edit area with saving data
  handleSaveClose = (e) => {
    this.setState({editing: false})
  }
  //close edit area without saving data
  handleUnsaveClose = (e) => {
    this.setState({editing: false})
  }
  //called when the user drop pics in drop zone
  onDrop = (file) => {
    //update this.state.files
    let newFileArray = update(this.state.files, {$push: file})
    let urlArray
    //update this.state.url
    this.setState({files : newFileArray},() => {
      urlArray = update(this.state.url, {$push: [this.state.files[this.state.files.length-1].preview]})
      this.setState({url: urlArray})
    })
  }
  render () {
    //when the edit area is opened, the button shows save
    let appBarButton
    if(this.state.editing){
      appBarButton = <FlatButton label="Save" 
      labelStyle={{fontWeight: "bold"}}
      icon={<FontIcon className="material-icons" style={{color: "white"}}>save</FontIcon> }
      onTouchTap={this.handleSaveClose}/>
    } else {
      //when the edit area is closed, the button shows edit
      appBarButton = <FlatButton label="Edit" 
      labelStyle={{fontWeight: "bold"}}
      icon={<FontIcon className="material-icons" style={{color: "white"}}>edit</FontIcon> }
      onTouchTap={this.handleOpen}/>
    }
    //create urlArray for passing to ReactRpg
    let urlArray = []
    let item = {}
    this.state.url.forEach((imgUrl)=>{
      item = {
        url: imgUrl,
        deleteHandler: (key)=>{
          this.setState({
            url: update(this.state.url, {$splice: [[key, 1]]})
          })
        }
    }
    urlArray.push(item)
    })
    //variable display contains dropzone, images, TextField and Tags area
    let display
    if(this.state.editing)
    {
      display = <div>
          <div>
            <Dropzone onDrop={this.onDrop} >
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
            <ReactRpg imagesArray={urlArray} padding={10} />
          </div>
          <TextField
          multiLine={true}
          floatingLabelText="Share your thoughts in here..."/>
          <Tags /> 
        </div>
    }
    return (
      <div>
      <AppBar 
        title={this.state.editing ? <TextField hintText="Enter title ..."
                underlineShow={false}
                inputStyle={{color: "white",fontSize: 20, fontWeight: "bold"}}/> : "Share your favs from here ..."}
        iconElementLeft={this.state.editing ? <IconButton><NavigationClose /></IconButton> : <div />}
        iconElementRight={appBarButton} />
        {display}
      </div>  
    )
  }
}