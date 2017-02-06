import React, { Component } from 'react'
import firebase from 'firebase'
import { ReactRpg } from 'react-rpg'
import Chip from 'material-ui/Chip'

export default class DisplayContext extends Component {
	constructor(props) {
		super(props);
		this.state = {
			datas: []
		}
	}
	componentWillMount() {
		var userId = firebase.auth().currentUser.uid;
		var datas = [];
		firebase.database().ref('/users/' + userId + '/data').on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        var data = childSnapshot.val();
        data['key'] = childSnapshot.key;
        datas.push(data);
      })
      this.setState({datas: datas})
    })
	}
	getUrl (array) {
		let urlArray = []
		array.forEach((img)=>{
			var url = { url: img}
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
	render(){
		let styles = this.getStyle()
		let displayBlock = []
		this.state.datas.forEach((data)=>{
			displayBlock.push(
				<div className="row" style={styles.divStyle} >
					<div className="col-md-12" key={data.key}>
						<h2> {data.title} </h2>
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
					</div>
				</div>)
		})


		return(
			<div className="container" style={{display: "block"}}>
						{displayBlock}
			</div>)
	}
}
