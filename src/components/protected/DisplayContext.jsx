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
			tagsArray.push(<Chip key={tags.key}> {tags.text} </Chip>)
		})
		return tagsArray
	}
	render(){
		let displayBlock = this.state.datas.map((items) => 
			<div key={items.key} style={{boder: "1px solid black"}}>
				<li >
					<p> {items.title} </p>
					<p> {items.discription? items.discription : "No discription"}</p>
					{ items.images? <ReactRpg imagesArray={this.getUrl(items.images)} columns={[ 1, 2, 5 ]} padding={10} /> : null}
					{ items.tags ? this.displayTags(items.tags) : null}
				</li>
				<br/ >
			</div>
		)


		return(
			<div>
				<ul >
						{displayBlock}
				</ul>
			</div>)
	}
}
