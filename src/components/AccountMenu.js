import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import firebase from 'firebase'
import { Link } from 'react-router-dom'
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

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

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <div style={{paddingTop: 5}}>
        <FlatButton
          onTouchTap={this.handleTouchTap}
          label={this.state.name === ""? this.state.email : this.state.name}
          icon={this.state.img==="" ? <FontIcon className="material-icons" style={{color: "white"}}>account_circle</FontIcon> : null }
          labelStyle={{color: 'white',fontWeight:'bold'}}>{this.state.img === "" ? null : <Avatar src={this.state.img} size={30}/>}</FlatButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose} >
          <Menu>
            <MenuItem primaryText="Refresh" />
            <MenuItem primaryText="Help &amp; feedback" />
            <MenuItem primaryText="Settings" containerElement={<Link to="/IconSetting" />}/>
            <MenuItem primaryText="Sign out" onTouchTap={this.props.onClick}/>
          </Menu>
        </Popover>
      </div>
    );
  }
}
AccountMenu.propTypes = {
  onClick: React.PropTypes.func
}