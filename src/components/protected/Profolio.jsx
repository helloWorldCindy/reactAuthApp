import React, { Component } from 'react'
import firebase from 'firebase'
import MenuItem from 'material-ui/MenuItem'
import { Link } from 'react-router-dom'
import FontIcon from 'material-ui/FontIcon'

class Profolio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  componentWillMount () {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId + '/info').on('value', (snapshot) => {
        var data = snapshot.val();
        this.setState({data: data})
      })
  }
  getStyle = () => {
    let styles = {
      colStyle: {
        display:"flex",
        flexDirection:"column",
        fontWeight: 300
      },
      imageStyle: {
        width: "70%",
        height: "70%",
        borderRadius: "50%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 40,
        marginBottom: 20
      },
      textStyle: {
        marginLeft: "auto",
        marginRight: "auto"
      },
      followerStyle: {
        display: "inherit",
        marginLeft: "auto",
        marginRight: "auto"
      }
    }
    return styles
  }

  render() {
    let styles = this.getStyle()
    return (
      <div className="row">
        <div className="col-md-12" style={styles.colStyle}>
          <img style={styles.imageStyle} src={this.state.data.img} role="presentation" />
          <p style={styles.textStyle}>id : {this.state.data.name} </p>
          <p style={{marginLeft: "auto",marginRight: "auto",fontStyle: "italic",color: "rgba(0,0,0,0.65)"}}>{this.state.data.description ? this.state.data.description : "There is no description"}</p>
          <p style={{marginLeft: "auto", marginRight: "auto"}}> tasks: {this.state.data.count}</p>
            <div className="col-md-12" style={styles.followerStyle}>
              <p style={{marginLeft: "auto", marginRight: "auto"}}> follower: {this.state.data.follower} </p>
              <p style={{marginLeft: "auto", marginRight: "auto"}}> following: {this.state.data.following}</p>
            </div>
          <div style={{marginTop: 20}}>
            <MenuItem style={{textAlign: "center", fontWeight: 300}}
              primaryText="Edit my profile" onTouchTap={this.props.onClose}containerElement={<Link to="/IconSetting" />}/>
            <MenuItem style={{textAlign: "center", fontWeight: 300}} primaryText="Sign out" onTouchTap={this.props.onClick} />
          </div>
        </div>
      </div>
    )
  }
}
Profolio.propTypes = {
  onClose: React.PropTypes.func,
  onClick: React.PropTypes.func
}
export default Profolio;