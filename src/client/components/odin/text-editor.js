import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';

import 'brace/mode/text';
import 'brace/ext/searchbox';
import 'brace/snippets/text';
import "brace/ext/language_tools";
//import 'brace/theme/monokai';
import 'brace/theme/github';


export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: this.props.contents
    };
    this.editorName   = this.props.name;
    this.onChange     = this.onChange.bind(this);
    this.maxChars     = 1000;
    this.saveContents = this.saveContents.bind(this);
  }

  onChange(newContents) {
    if (newContents.length <= this.maxChars) {
      //console.log("updating text...");
      this.setState({contents: newContents});
      this.props.action(newContents);
    } else {
      this.refs[this.editorName].editor.setValue(this.state.contents, 1);
      console.log("Toast!");
      toast.error(`Exceeded limit of ${this.maxChars.toLocaleString()} characters!`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
        toastId: 42,
        className: css({
          background: 'rgb(220,20,60)'
        })
      });
    }
  }

  componentDidMount() {
    console.log("Mounting here...");
    // ensure the parent is aware of the default content
    this.props.action(this.state.contents);
  }

  saveContents() {
    //console.log("saving contents...");
    const element = document.createElement("a");
    const file = new Blob([this.state.contents], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "text-for-rules.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  render() {
    const saveHandler = this.saveContents;
    return (
      <React.Fragment>
        <ToastContainer />
        <AceEditor
          mode="text"
          theme="github"
          onChange={this.onChange}
          name={this.props.name}
          ref={this.props.name}
          width={"100%"}
          wrapEnabled={true}
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
      </React.Fragment>
    )
  }
}
