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
import DisplayContext from './DisplayContext'
import firebase from 'firebase'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'

export default class CreateContext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      files: [],
      url: [],
      description: "",
      save: false,
      tags: [],
      title: "Unnamed",
      choice: 1
    }
  }
  //open edit area
  handleOpen = (e) => {
    this.setState({save: false})
    this.setState({editing: true})
  }
  //close edit area with saving data
  handleSaveClose = (e) => {
    this.setState({save: true})
  }
  handleSubmit = (tags) => {
    var userId = firebase.auth().currentUser.uid;
    let currentDate = new Date().toString()
    firebase.database().ref('users/' + userId + '/data' ).push({
      images: this.state.url,
      description: this.state.description,
      tags: tags,
      title: this.state.title,
      choice: this.state.choice,
      time: currentDate
    }).then(
      this.setState({
      editing: false,
      files: [],
      url: [],
      description: "",
      save: false,
      choice: 1,
      title: "Unnamed"}))
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
      urlArray = update(this.state.url, {$push: [{url:this.state.files[this.state.files.length-1].preview,id:Date.now()}]})
      this.setState({url: urlArray})
    })
  }

  getUrlArray = () => {
    //create urlArray for passing to ReactRpg
    let urlArray = []
    let item = {}
    this.state.url.forEach((imgUrl)=>{
      item = {
        url: imgUrl.url,
        deleteHandler: (key)=>{
          this.setState({
            url: update(this.state.url, {$splice: [[key, 1]]})
          })
        }
    }
    urlArray.push(item)
    })
    return urlArray
  }

  getStyle () {
    let style ={
      divStyle : {
        border: "2px solid rgba(166, 228, 252, 1)",
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: "auto",
        marginRight: "auto",
        display: "block"
      }
    }
    return style
  }
  handleSelectFieldChange = (event, index, value) => {
    this.setState({choice: value})
  }
  render () {
    let styles = this.getStyle()
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

    //variable display contains dropzone, images, TextField and Tags area
    let display
    if(this.state.editing)
    {
      display = <div style={styles.divStyle}>
          <div style={{marginTop: 20, marginBottom: 20, paddingLeft: 10}} className="row">
            <div className="col-md-12">
              <Dropzone onDrop={this.onDrop}>
                <div>Try dropping some files here, or click to select files to upload.</div>
              </Dropzone>
            </div>
          </div>
          <div className="col-md-12">
            <ReactRpg imagesArray={this.getUrlArray()} padding={10} />
          </div>
          <TextField
          style={{paddingLeft: 10}}
          multiLine={true}
          onChange={(e)=>{this.setState({description: e.target.value})}}
          floatingLabelText="Share your thoughts in here..."/>
          <Tags submit={this.state.save} onSubmit={this.handleSubmit} value={this.state.tags}/> 
          <div style={{paddingLeft: 10, marginTop: -20}}>
            <SelectField floatingLabelText="Order by"
              value={this.state.choice} onChange={this.handleSelectFieldChange}>
              <MenuItem value={1} primaryText="Public" />
              <MenuItem value={2} primaryText="Only friends can see" />
              <MenuItem value={3} primaryText="Only I can see" />
            </SelectField>
          </div>
        </div>
    }
    return (
      <div>
        <AppBar 
          title={ this.state.editing ? <TextField hintText="Enter title ..."
                  underlineShow={false}
                  inputStyle={{color: "white",fontSize: 20, fontWeight: "bold"}}
                  onChange={(e)=>{this.setState({title: e.target.value})}}
                  hintStyle={{fontSize: 20}} /> : "Share your favs from here ..."}
          iconElementLeft={this.state.editing ? <IconButton onMouseDown={this.handleUnsaveClose}><NavigationClose /></IconButton> : <div />}
          iconElementRight={appBarButton} />
          {display}
        <div style={{marginTop: 20, marginBottom:20}} >
          <DisplayContext />
        </div>
      </div>  
    )
  }
}