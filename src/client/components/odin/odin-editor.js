import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import CustomOdinMode from "./custom-odin-mode";
//import 'brace/mode/yaml';
import 'brace/mode/text';
import 'brace/ext/searchbox';
import 'brace/snippets/yaml';
import 'brace/snippets/text';
import "brace/ext/language_tools";
import 'brace/theme/monokai';

export default class OdinEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: this.props.contents
    };
    this.editorName   = this.props.name;
    this.onChange     = this.onChange.bind(this);
    this.saveContents = this.saveContents.bind(this);
  }

  onChange(contents) {
    this.setState({contents: contents});
    this.props.action(contents);
  }

  componentDidMount() {
    const customMode = new CustomOdinMode();
    this.refs[this.editorName].editor.getSession().setMode(customMode);
    // ensure the parent is aware of the default content.
    this.props.action(this.state.contents);
  }

  saveContents() {
    //console.log("saving contents...");
    const element = document.createElement("a");
    const file = new Blob([this.state.contents], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "rules.yml";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  render() {
    const saveHandler = this.saveContents;
    return (
      <AceEditor
        mode="text"
        theme="monokai"
        onChange={this.onChange}
        name={this.editorName}
        ref={this.editorName}
        width={"100%"}
        highlightActiveLine={true}
        showGutter={true}
        value={this.state.contents}
        editorProps={{$blockScrolling: true}}
        commands={[{   // commands is array of key bindings.
          name: 'saveContents', //name for the key binding.
          bindKey: {win: 'Ctrl-s', mac: 'Command-s'}, //key combination used for the command.
          exec: () => {
            console.log("trying to save...");
            saveHandler();
          }  //function to execute when keys are pressed.
        }]}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
          minLines: this.props.minLines,
          maxLines: this.props.maxLines
        }}
      />
    )
  }
}
