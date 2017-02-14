import React, { Component } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import FontIcon from 'material-ui/FontIcon'
import update from 'immutability-helper'
import IconButton from 'material-ui/IconButton'

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      searchText: ""
    }
  }

  handleDataSubmit = (e) => {
    let newDataArray = update(this.state.dataSource, {$push: [this.state.searchText]})
    this.props.onSearch(this.state.searchText)
    this.setState({ dataSource : newDataArray, searchText: ""});
  }

  handleUpdateInput = (value) => {
    this.setState({searchText: value})
  }

  render() {
    return (
      <div>
        <IconButton iconStyle={{fontSize: 20, color: "rgba(0,0,0,0.54)"}} onMouseDown={this.props.onCancelSearch}><FontIcon className="material-icons">keyboard_backspace</FontIcon></IconButton>
        <FontIcon className="material-icons" style={{fontSize: 20, color: "rgba(0,0,0,0.54)"}}> search </FontIcon>
          <AutoComplete
            onUpdateInput={this.handleUpdateInput}
            hintText="Search from here"
            dataSource={this.state.dataSource}
            searchText={this.state.searchText}
            onKeyPress={(e)=>{
              if(e.key === "Enter") {
                this.handleDataSubmit(e)
              }
            }} />
      </div>
    )
  }
}

SearchBar.propTypes = {
  onSearch: React.PropTypes.func,
  onCancelSearch: React.PropTypes.func
}
export default SearchBar;