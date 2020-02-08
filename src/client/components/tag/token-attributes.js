import React from 'react';
import Select from 'react-select';

// dropdown for token labels associated with lower graph
export default class TokenAttributeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.tokenAttributeSelection,
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    // TODO: add callback to fn passed via props
    console.log(`Option selected: ${selectedOption}`);
    this.props.action(selectedOption);
  }
  render() {
    const { selectedOption } = this.state;
    return (
      <Select
        className="tagTokenAttributeSelector"
        value={selectedOption}
        onChange={this.handleChange}
        options={this.props.options}
      />
    );
  }
}
