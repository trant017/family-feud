import React, { Component } from "react";
import { Link } from "react-router";

export default class Backend extends Component {
  render() {
    return (
      <div className="container">
        <nav>
          <Link to="/admin">Admin</Link>
          <Link to="/controls">Controls</Link>
        </nav>
        {this.props.children}
      </div>
    );
  }
}
