import React, { Component } from "react";
import { Link } from "react-router";

export default class Backend extends Component {
  render() {
    return (
      <div className="container">
        <h1>Control Panel</h1>
        {this.props.children}
      </div>
    );
  }
}
