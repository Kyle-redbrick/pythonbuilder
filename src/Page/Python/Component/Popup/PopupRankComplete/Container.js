import React, { Component } from "react";
import View from "./View";

class Container extends Component {
  render() {
    return <View handlePopupShow={this.props.handlePopupShow} />;
  }
}

export default Container;
