import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
//import * as mdData from './markdown/example-1.md';
import CodeBlock from "./code-block";

class OdinExample extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="odinExample">
        <ReactMarkdown
          source={this.props.source}
          renderers={{ code: CodeBlock }}
        />
      </div>
    )
  }
}
