import React, { Component } from 'react'
import Chip from 'material-ui/Chip'
import TextField from 'material-ui/TextField'
import firebase from 'firebase'

class Tags extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {items: this.props.value, text: ''}
    this.styles = {
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    }
  }


  handleSubmit(e) {
    e.preventDefault();
    var newItem = {
      text: this.state.text,
      key: this.state.items.length
    };
    this.setState((prevState) => ({
      items: prevState.items.concat(newItem),
      text: ''
    }));
  }

  handleRequestDelete = (key) => {
    console.log(this.state.items)
    this.chipData = this.state.items;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
    this.chipData.splice(chipToDelete, 1);
    this.setState({items: this.chipData});
  };

  renderChip(data) {
    return (
      <Chip
        key={data.key}
        onRequestDelete={() => this.handleRequestDelete(data.key)}
        style={this.styles.chip}
      >
        {data.text}
      </Chip>
    );
  }


  render() {
    if(this.props.submit){
      this.props.onSubmit(this.state.items)
    }
    return (
      <div>
        <div style={this.styles.wrapper}>
          {this.state.items.map(this.renderChip, this)}
        </div>
        <TextField 
          onChange={(e)=>{this.setState({text: e.target.value})}}
          onKeyPress={(e)=>{
            if(e.key === "Enter") {
              this.handleSubmit(e)
            }
          }} 
          value={this.state.text}
          floatingLabelText="Enter tags"/>
      </div>
    );
  }
}

Tags.propTypes = {
  submit: React.PropTypes.bool,
  onSubmit: React.PropTypes.func
}
export default Tags;