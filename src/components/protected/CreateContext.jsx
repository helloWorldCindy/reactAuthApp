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

export default class CreateContext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      files: [],
      url: []
    }
  }
  handleOpen = (e) => {
    this.setState({editing: true})
  }
  handleSaveClose = (e) => {
    this.setState({editing: false})
  }
  handleUnsaveClose = (e) => {
    this.setState({editing: false})
  }
  onDrop = (file) => {
    let newFileArray = update(this.state.files, {$push: file})
    let urlArray
    this.setState({files : newFileArray},() => {
      urlArray = update(this.state.url, {$push: [this.state.files[this.state.files.length-1].preview]})
      this.setState({url: urlArray})
    })
  }
  render () {
    let appBarButton
    if(this.state.editing){
      appBarButton = <FlatButton label="Save" 
      labelStyle={{fontWeight: "bold"}}
      icon={<FontIcon className="material-icons" style={{color: "white"}}>save</FontIcon> }
      onTouchTap={this.handleSaveClose}/>
    } else {
      appBarButton = <FlatButton label="Edit" 
      labelStyle={{fontWeight: "bold"}}
      icon={<FontIcon className="material-icons" style={{color: "white"}}>edit</FontIcon> }
      onTouchTap={this.handleOpen}/>
    }
    let urlArray = []
    let item = {}
    this.state.url.forEach((imgUrl)=>{
      item = {
        url: imgUrl,
        hoverHandler: (url, obj) => { console.log(url) }}
      urlArray.push(item)
    })
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
          row={2}
          floatingLabelText="Share your thoughts in here..."/>
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