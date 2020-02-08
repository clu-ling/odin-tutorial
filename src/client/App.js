import React, { Component } from 'react';

import OdinRoutes from './routes';
// import TreeNav from './tree-view';

// const config = require('../../config');

export default class App extends Component {
  constructor(props) {
    super(props);
  }
  //    return (<TreeNav/>)
  render() {
    return (<OdinRoutes/>)
  }
}
