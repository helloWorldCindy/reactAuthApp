import React, { Component } from 'react'
import firebase from 'firebase'
import { ReactRpg } from 'react-rpg'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import SearchBar from './SearchBar'
import OrderData from './OrderData'


export default class DisplayContext extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datas: [],
			displayData: [],
			found: true
		}
	}
	componentWillMount() {
		var userId = firebase.auth().currentUser.uid;
		var datas;
		firebase.database().ref('/users/' + userId + '/data').on('value', (snapshot) => {
			datas = []
      snapshot.forEach((childSnapshot) => {
        var data = childSnapshot.val();
        data['key'] = childSnapshot.key;
        datas.push(data);
      })
      this.setState({datas: datas,displayData: datas})
    })
	}
	getUrl (array) {
		let urlArray = []
		array.forEach((img)=>{
			var url = { url: img.url}
			urlArray.push(url)
		})
		return urlArray
	}
	displayTags (array) {
		let tagsArray = []
		array.forEach((tags)=>{
			tagsArray.push(<Chip style={{display: "inline-block", marginLeft: 5, marginRight: 5}} key={tags.key}> {tags.text} </Chip>)
		})
		return tagsArray
	}

	handleSearch = (searchItem) => {
		let searchArray = []
		this.state.datas.forEach((data)=>{
			if(data.description.toLowerCase().indexOf(searchItem) !== -1 || data.title.toLowerCase().indexOf(searchItem) !== -1){
				searchArray.push(data)
			}
		})
		if(searchArray.length === 0)
		{
			this.setState({found: false})
		}
		else {
			this.setState({found: true})
		}
		this.setState({displayData: searchArray})
	}
	handleCancelSearch = () => {
		this.setState({displayData: this.state.datas})
		if(!this.state.found){
			this.setState({found: true})
		}
	}
	handleSort = (option) => {
		let array
		if(option === 2) {
			array = this.state.displayData.sort(function(a,b){
  			return new Date(b.time) - new Date(a.time)
			})
			this.setState({displayData: array})
		}
		if(option === 1) {
			array = this.state.displayData.sort(function(a,b){
  			return new Date(a.time) - new Date(b.time)
			})
			this.setState({displayData: array})
		}
		if(option === 3) {
			array = this.state.displayData.sort((a,b)=>{
				return a.title > b.title
			})
			this.setState({displayData: array})
		}
		if(option === 4) {
			array = this.state.displayData.sort((a,b)=>{
				return b.title > a.title
			})
			this.setState({displayData: array})
		}

	}
	render(){
		let displayBlock = []
		this.state.displayData.forEach((data)=>{
			displayBlock.push(
				<div className="row" style={{
					border: data.choice === 1 ? "2px solid rgba(166, 228, 252, 1)" : ( data.choice === 2 ? "2px solid rgb(255, 153, 153)" : "2px solid rgb(238, 204, 255)"),
					borderRadius: 10,
					marginTop: 20,
					marginBottom: 20,
					marginLeft: "auto",
					marginRight: "auto",
					display: "block"
					}}
				key={data.key}>
					<div className="col-md-12" >
						{ data.choice === 2 ? <p style={{float: "right", color: "rgb(255, 153, 153)"}}> Friends only </p> : (data.choice === 3 ? <p style={{float: "right", color: "rgb(238, 204, 255)"}}> Me only </p> : null)}
						<h2 style={{fontWeight: "bold"}}> {data.title} </h2>
						<p> {data.description? data.description : "No discription"}</p>
						<div className="row">
							<div className="col-md-12">
								{ data.images? <ReactRpg imagesArray={this.getUrl(data.images)} columns={[ 1, 2, 5 ]} padding={10} /> : <p> No Picture </p>}
							</div>
						</div>
						{ data.tags ?  
							<div className="row">
								<div className="col-md-12"> 
									{this.displayTags(data.tags)} 
								</div>
							</div>: null}
						<div className="row">
							<div className="col-md-12">
								<p style={{color: "#78797A"}}> created on : {data.time} </p>
							</div>
						</div>
						<RaisedButton primary={true} style={{marginBottom: 10}} label="Delete" onTouchTap={(e)=>{
							var userId = firebase.auth().currentUser.uid
							firebase.database().ref('/users/' + userId + '/data').child(data.key).remove()}} />
					</div>
				</div>
				)
		})

		if(!this.state.found){
			displayBlock = <div style={{fontSize: 30, color: "rgba(0,0,0,0.54)"}}><h1>Data not found </h1></div>
		}
		return(
			<div className="container" style={{display: "block"}}>
						<div className="row" style={{display: "flex"}}>
							<div className="col-md-12">
								<SearchBar onSearch={this.handleSearch} onCancelSearch={this.handleCancelSearch}/>
							</div>
							<div className="col-md-12">
								<OrderData onSort={this.handleSort}/>
							</div>
						</div>
						{displayBlock}
			</div>)
	}
}
