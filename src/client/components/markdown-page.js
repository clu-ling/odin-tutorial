import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
//import * as mdData from './markdown/example-1.md';
import CodeBlock from "./code-block";

export default class MarkdownPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="infoPage">
        <ReactMarkdown
          source={this.props.source}
          renderers={{ code: CodeBlock }}
        />
      </div>
    )
  }
}
