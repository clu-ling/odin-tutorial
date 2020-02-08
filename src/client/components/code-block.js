import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// https://github.com/conorhastings/react-syntax-highlighter/blob/master/AVAILABLE_STYLES_PRISM.MD
import { darcula as codeStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default class CodeBlock extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string
  };

  static defaultProps = {
    language: null
  };

  render() {
    const { language, value } = this.props;
    return (
      <SyntaxHighlighter
        language={language}
        showLineNumbers={true}
        style={codeStyle}>
        {value}
      </SyntaxHighlighter>
    );
  }
}
