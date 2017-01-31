import React, { Component } from 'react'
import firebase from 'firebase'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [], 
      text: ''
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
      <div>
          <div>
            <TodoList items={this.state.items} />
            <form onSubmit={this.handleSubmit}>
              <input onChange={this.handleChange} value={this.state.text} />
              <button>{'Add #' + (this.state.items.length + 1)}</button>
            </form>
          </div>
      </div>
    );
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.key}>{item.text}</li>
        ))}
      </ul>
    );
  }
}

export default Dashboard;