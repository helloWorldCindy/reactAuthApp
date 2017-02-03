import React, { Component } from 'react'
import './react-rpg.css'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

export default class ReactRpgPhoto extends Component {
  render(){
    return (
          <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
            <div className="hovereffect">
              <img className="img-responsive" src={this.props.url} alt="" />
              <div className="overlay" >
                <h2>Delete</h2>
                <IconButton iconStyle={{color: "white"}} onMouseDown={(e)=>{this.props.deleteHandler(this.props.index)}}>
                  <FontIcon className="material-icons" style={{color: "white"}}>delete_forever</FontIcon>
                </IconButton>
              </div>
          </div>
        </div>
    );
  }
};

ReactRpgPhoto.propTypes = {
  url: React.PropTypes.string.isRequired,
  padding: React.PropTypes.number,
  clickHandler: React.PropTypes.func,
  deleteHandler: React.PropTypes.func,
  index: React.PropTypes.number
};
