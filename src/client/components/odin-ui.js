import React, { Component } from 'react';
//import { Appdiv } from './UIElements';
import {
  Alignment,
  AnchorButton,
  Card,
  Classes,
  Elevation,
  HTMLTable,
  Icon,
  InputGroup,
  Intent,
  NavBar,
  TextArea
} from "@blueprintjs/core";
import { IconName } from "@blueprintjs/icons";
import './../app.css';
import "text-annotation-graphs/dist/tag/css/tag.css"
import axios from 'axios';
import TextEditor from './odin/text-editor';
import OdinEditor from './odin/odin-editor';
import TAGdiv from './tag/tag-div';
import _ from 'lodash';

const config = require('../../../config');

//<Icon icon={icon} iconSize={iconSize} intent={intent} />

//import ReactImage from './react.png';

export default class OdinUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: null,
      rules: this.props.rules,
      text: this.props.text,
      results: null,
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.onSubmit           = this.onSubmit.bind(this);
    this.submitData         = this.submitData.bind(this);
    this.updateRules        = this.updateRules.bind(this);
    this.updateText         = this.updateText.bind(this);
    this.onResize           = this.onResize.bind(this);
  }

  createNavBar() {
    return (
      <Navbar>
          <Navbar.Group align={Alignment.LEFT}>
              <Navbar.Heading>Blueprint</Navbar.Heading>
              <Navbar.Divider />
              <Button className="bp3-minimal" icon="home" text="Home" />
              <Button className="bp3-minimal" icon="document" text="Files" />
          </Navbar.Group>
      </Navbar>
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    if (this.props.preFetch) {
      // console.log("I'm supposed to pre-fetch");
      // console.log(`rules: ${this.state.rules}`);
      // console.log(`text: ${this.state.text}`);
      this.submitData();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  onResize() {
    //console.log("Resize detected...");
    this.setState({
      height: window.innerHeight,
      width: window.innerWidth
    });
  }

  submitData() {
    this.setState({
      errorMsg: null,
      results: null
    });
    console.log("Inside onSubmit!");
    const data = {};
    data[config.odin.api.extract.params.rules] = this.state.rules;
    data[config.odin.api.extract.params.text]  = this.state.text;
    axios.get('/api/extract', {
      params: data,
    }).then(res => {
      const response = res.data;
      if (response.hasOwnProperty('error')) {
        this.setState({errorMsg: response.error});
      } else {
        console.log("Updating results...");
        this.setState({
          results: response
        });
      }
    });
  }

  onSubmit(event) { this.submitData() }

  updateRules(contents) {
    // console.log("Inside updateRules");
    // console.log(contents);
    this.setState({rules: contents});
  }

  updateText(contents) {
    // console.log("Inside updateText");
    // console.log(contents);
    this.setState({text: contents});
  }

  // creates input fields for search
  createSearchInterface() {
    const minWidth = this.state.width * .80;
    const maxWidth = this.state.width * .9;
    return (
      <div
        className="searchParams"
        style={{minWidth: minWidth, maxWidth: maxWidth}}
      >
        <OdinEditor
          contents={this.props.rules}
          name="OdinAce"
          minLines={config.editor.minLines}
          maxLines={config.editor.maxLines}
          action={this.updateRules}
        />
        <TextEditor
          contents={this.props.text}
          name="TextAce"
          minLines={config.editor.minLines}
          maxLines={config.editor.maxLines}
          action={this.updateText}
        />
        <AnchorButton
          onClick={this.onSubmit}
          style={{minWidth: "50px"}}
          type="button"
          text="Extract"
          className="btn"
        />
    </div>
    );
  }

  // process results
  createResultsDiv() {
    return (
      <TAGdiv
        format={config.tag.format}
        data={this.state.results}
        showTopMainLabel={this.props.showTopMainLabel}
        showTopArgLabels={this.props.showTopArgLabels}
        bottomTagCategory={this.props.bottomTagCategory}
        bottomLinkCategory={this.props.bottomLinkCategory}
        compactRows={this.props.compactRows}
        rowVerticalPadding={this.props.rowVerticalPadding}
        linkSlotInterval={this.props.linkSlotInterval}
      ></TAGdiv>
    );
  }

  // As the name suggests, this is what controls the appearance/contents of the page.
  // TODO: Add react-tabs for [RESULTS, DETAILS] https://reactcommunity.org/react-tabs/
  render() {
    if (this.state.errorMsg) {
      return (
        <div
          className="odinUI"
          >
          {this.createSearchInterface()}
          <div
            className="errorMsg"
            >
            {this.state.errorMsg}
          </div>
        </div>
      );
    } else if (this.state.results) {
      return (
        <div
          className="odinUI"
          >
          {this.createSearchInterface()}
          <hr></hr>
          {this.createResultsDiv()}
        </div>
      )
    } else {
      return (
        <div
          className="odinUI"
          >
          {this.createSearchInterface()}
        </div>
      )
    }
  }
}
