import React, { Component } from 'react';
import TAG from "text-annotation-graphs";
import TokenAttributeSelect from "./token-attributes";
import GraphSelect from "./graph-options";
import {
  Alignment,
  AnchorButton,
  Classes,
  Intent,
  Slider
} from "@blueprintjs/core";

export default class TAGdiv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 100,
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.tagRef               = React.createRef();
    this.tagInstance          = null;

    this.bottomTagCategory    = this.props.bottomTagCategory;
    this.bottomLinkCategory   = this.props.bottomLinkCategory;
    this.exportSVG            = this.exportSVG.bind(this);
    this.resizeTag            = this.resizeTag.bind(this);
    this.formatWidthDisplay   = this.formatWidthDisplay.bind(this);
    this.toggleTokenAttribute = this.toggleTokenAttribute.bind(this);
    this.toggleGraphSelection = this.toggleGraphSelection.bind(this);
    this.onResize             = this.onResize.bind(this);
    this.redraw               = this.redraw.bind(this);

    this.tokenAttributeOptions = {
      "POS": {value: "POS", label: "POS tags", description: "part of speech (functional category) for each word."},
      "lemma": {value: "lemma", label: "Lemmas", description: "Canonical (least marked) form of each word."},
      "entity": {value: "entity", label: "NE labels", description: "Named entity (NE) labels in IOB notation."},
      "chunk": {value: "chunk", label: "XP chunks", description: "Sequence labels for lowest occurring XP chunks (ex. 'B-NP I-NP')."}
    };

    this.graphOptions = {
      "none": {value: "none", label: "<hide bottom graph>", description: "hide the bottom graph."},
      "universal-enhanced": {value: "universal-enhanced", label: "Universal Enhanced Dependencies", description: "Use Universal Enhanced dependencies."},
      "universal-basic": {value: "universal-basic", label: "Universal Basic Dependencies", description: "Use Universal Basic dependencies."},
      "semantic-roles": {value: "semantic-roles", label: "Semantic Roles", description: "Use graph of semantic roles."},
    };

  }

  redraw() {
    if (this.tagInstance) {
      this.tagInstance.resize();
      this.tagInstance.redraw();
    }
  }

  resizeTag(newValue) {
    // console.log(`resize TAG container to ${newValue}`);
    this.setState({containerWidth: newValue});
    this.redraw();
  }

  formatWidthDisplay(newWidth) {
    return `${newWidth}%`;
  }

  exportSVG(event) {
    if (this.tagInstance) {
      this.tagInstance.exportSvg();
    }
    this.setState({rules: event.target.value});
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    console.log(`showMainLabel: ${this.props.showMainLabel}`);
    console.log(`showArgLabels: ${this.props.showArgLabels}`);
    const TAGinstance = TAG.tag({
      container: this.tagRef.current,
      data: this.props.data,
      format: this.props.format,
      // Overrides for default options
      options: {
        showTopMainLabel: this.props.showTopMainLabel,
        showTopArgLabels: this.props.showTopArgLabels,
        bottomLinkCategory: this.props.bottomLinkCategory,
        linkSlotInterval: this.props.linkSlotInterval,
        compactRows: this.props.compactRows,
        rowVerticalPadding: this.props.rowVerticalPadding
      }
    });
    this.tagInstance = TAGinstance;
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
    console.log('redrawing TAG');
    this.redraw();
  }

  toggleTokenAttribute(item) {
    //console.log("Inside toggleTokenAttribute");
    //console.log(item);
    if (this.tagInstance) {
      this.tagInstance.setBottomTagCategory(item.value);
      console.log(`Set bottom category to ${item.value}`);
      // console.log(this.tagInstance.words);
    }
  }

  toggleGraphSelection(item) {
    //console.log("Inside toggleGraphSelection");
    //console.log(item);
    if (this.tagInstance) {
      this.tagInstance.setBottomLinkCategory(item.value);
      console.log(`Set bottom graph to ${item.value}`);
    }
  }
  // update TAG whenever data props change.
  componentDidUpdate(oldProps) {
    const newProps = this.props
    if(oldProps.data !== newProps.data && this.tagInstance) {
      this.tagInstance.loadData(this.props.data, this.props.format);
      //this.setState({ ...something based on newProps.field... })
    }
  }

  render() {
    // check if div needs to update
    // if (this.tagInstance && this.props.data) {
    //   console.log(this.props.data);
    //   this.tagInstance.loadData(this.props.data, config.tag.format);
    // };
    const containerWidth = `${this.state.containerWidth}%`;
    const maxWidth       = this.state.width *.9;

    const desiredTokenAttribute  = this.tokenAttributeOptions[this.bottomTagCategory];
    const selectedTokenAttribute = desiredTokenAttribute ? desiredTokenAttribute : Object.values(this.tokenAttributeOptions.values)[0];

    const desiredGraph  = this.graphOptions[this.bottomLinkCategory];
    const selectedGraph = desiredGraph ? desiredGraph : Object.values(this.graphOptions)[0];

    // TODO: ensure props.data is defined
    return (
      <div
        className="results"
        style={{maxWidth: maxWidth}}
      >
        <div className="tagMenu">
          <Slider
              className="tagUIwidthSlider tagUIelement"
              min={8}
              max={100}
              stepSize={1}
              labelRenderer={this.formatWidthDisplay}
              labelStepSize={100}
              onChange={this.resizeTag}
              value={this.state.containerWidth}
              vertical={false}
          />
          <GraphSelect
            className="tagUIelement"
            graphSelection={selectedGraph}
            options={Object.values(this.graphOptions)}
            action={this.toggleGraphSelection}
            />
          <TokenAttributeSelect
            className="tagUIelement"
            tokenAttributeSelection={selectedTokenAttribute}
            options={Object.values(this.tokenAttributeOptions)}
            action={this.toggleTokenAttribute}
            />
          <AnchorButton
            className="tagUIexportBtn tagUIelement"
            onClick={this.exportSVG}
            type="button"
            icon="floppy-disk"
            text="Save SVG"
          />
        </div>
        <div
          ref={this.tagRef}
          style={{width: containerWidth}}
          className="tagContainer"
        ></div>
      </div>
    )
  }
}
