import React from 'react';
import Select from 'react-select';

// dropdown for bottom graph
export default class GraphSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.graphSelection
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    //console.log(`Option selected: ${selectedOption}`);
    this.props.action(selectedOption);
  }
  render() {
    const { selectedOption } = this.state;
    //console.log(`this.props.graphSelection: ${this.props.graphSelection}`);
    //console.log(`selectedOption: ${this.state.selectedOption}`);
    return (
      <Select
        className="tagGraphSelector"
        value={selectedOption}
        onChange={this.handleChange}
        options={this.props.options}
      />
    );
  }
}
