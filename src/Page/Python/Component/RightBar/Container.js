import React, { Component } from "react";
import { connect } from "react-redux";
import Parser from "../util/parser";
import View from "./View";

class Container extends Component {
  constructor(props) {
    super(props);
    this.ace = window.ace;
    this.aceEditor = undefined;
    this.state = {};
  }
  componentDidMount() {
    this.aceEditor = this.ace.edit("Python__Editor");
  }

  handleRightButton = (type) => {
    switch (type) {
      case "zoomIn":
        const zoomInsize = this.aceEditor.getFontSize() + 2;
        if (zoomInsize > 50) {
          return;
        }
        localStorage.setItem("wizFontSize", zoomInsize);
        this.aceEditor.setFontSize(zoomInsize);
        this.refreshCompleterPopupSize();
        break;
      case "zoomOut":
        const MIN_SIZE = 8;
        const zoomOutsize = this.aceEditor.getFontSize() - 2;
        if (zoomOutsize < MIN_SIZE) {
          return;
        }
        localStorage.setItem("wizFontSize", zoomOutsize);
        this.aceEditor.setFontSize(zoomOutsize);
        this.refreshCompleterPopupSize();
        break;
      case "align":
        const code = this.aceEditor.getValue();
        const parsedCode = Parser.parseForSort(code);
        this.aceEditor.setValue(parsedCode, 1);
        break;
      default:
        break;
    }
  };

  refreshCompleterPopupSize = () => {
    if (this.aceEditor.completer) {
      const percent = this.aceEditor.getFontSize() + 10 + "%";
      this.aceEditor.completer.popup.container.style.width = percent;
    }
  };

  render() {
    // const {} = this.state;
    const { handleRightButton } = this;
    const { handleToggleThumbnail, userType } = this.props;
    return (
      <View handleRightButton={handleRightButton} handleToggleThumbnail={handleToggleThumbnail} userType={userType} />
    );
  }
}

export default connect((state) => ({ email: state.userinfo.email }))(Container);
