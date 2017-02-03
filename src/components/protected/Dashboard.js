import React, { Component } from 'react'
import firebase from 'firebase'
import CreateContext from './CreateContext'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [], 
      text: '',
      files: [],
      url:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount () {
   var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId + '/info/items').on('value', function(snapshot) {
      var items = [];
      snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item['key'] = childSnapshot.key;
        items.push(item);
      });
      this.setState({
        items: items
      });
    }.bind(this));
  }

  handleChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    var userId = firebase.auth().currentUser.uid;
    var newItem = {
      text: this.state.text,
      id: Date.now()
    }
    this.setState((prevState) => ({
      items: prevState.items.concat(newItem),
      text: ''
    }));
    firebase.database().ref('users/' + userId + '/info/items' ).push({
      text: newItem.text,
      id: newItem.id
    });
    this.setState({text: ""});
  }

  render() {
    return (
        <CreateContext />
    );
  }
}

export default Dashboard;