import React, { Component } from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'

class OrderData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1
    }
  }
  handleChange = (event, index, value) => 
  {
    this.setState({value});
    this.props.onSort(value)
  }
  render() {
    return (
      <div style={{marginTop: -20}}>
        <SelectField floatingLabelText="Order by"
          value={this.state.value} onChange={this.handleChange}>
          <MenuItem value={1} primaryText="Old to new" />
          <MenuItem value={2} primaryText="New to old" />
          <MenuItem value={3} primaryText="Title Ascending" />
          <MenuItem value={4} primaryText="Title Descending" />
        </SelectField>
      </div>
    )
  }
}
OrderData.propTypes = {
  onSort: React.PropTypes.func
}
export default OrderData;