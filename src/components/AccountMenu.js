import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import firebase from 'firebase'
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import Profolio from './protected/Profolio'

export default class AccountMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      name: '',
      img: '',
      email: ''
    };
  }

  componentWillMount () {
   var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId + '/info').on('value', function(snapshot) {
      this.setState({name: snapshot.val().name, img: snapshot.val().img, email: snapshot.val().email})
    }.bind(this));
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({open: !this.state.open})
  };

  handleClick = () => {
    this.setState({open: false})
    this.props.onClick()
  }

  render() {
    return (
      <div style={{paddingTop: 5,zIndex:99}}>
        <FlatButton
          onTouchTap={this.handleTouchTap}
          label={this.state.name === ""? this.state.email : this.state.name}
          icon={this.state.img==="" ? <FontIcon className="material-icons" style={{color: "white"}}>account_circle</FontIcon> : null }
          labelStyle={{color: 'white',fontWeight:'bold'}}>{this.state.img === "" ? null : <Avatar src={this.state.img} size={30}/>}</FlatButton>
        <Drawer open={this.state.open} onRequestChange={() => {
          this.setState({open: false})}} docked={false}>
          <Profolio onClick={this.handleClick} onClose={()=>{this.setState({open: false})}}/>
        </Drawer>
      </div>
    );
  }
}
AccountMenu.propTypes = {
  onClick: React.PropTypes.func
}