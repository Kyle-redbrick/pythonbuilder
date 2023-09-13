import React, { Component } from "react";
import "./index.scss";

class OneInputPopUp extends Component {
  render() {
    const { title, subtitle, defaultInput, placeholder, buttonName, buttonAction, dismiss } = this.props;
    this.inputRef = React.createRef();
    return (
      <div className="popup_oneinput">
        <div className="popup_header">{title || "title"}</div>
        {subtitle && <div className="popup_subtitle">{subtitle}</div>}
        <input
          className="popup_input popup_input-oneinput"
          defaultValue={defaultInput}
          placeholder={placeholder}
          ref={this.inputRef}
        />
        <button
          className="popup_button popup_button-oneinput"
          onClick={() => {
            if (dismiss) dismiss();
            if (buttonAction) buttonAction(this.inputRef.current.value);
          }}
        >
          {buttonName || "confirm"}
        </button>
      </div>
    );
  }
}

export default OneInputPopUp;
