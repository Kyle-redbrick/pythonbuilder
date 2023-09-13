import React, { Component } from "react";
import "./index.scss";

class OneButtonPopUp extends Component {
  render() {
    const { title, subtitle, buttonName, buttonAction, dismiss } = this.props;
    return (
      <div className="popup_onebutton">
        <div className="popup_title">{title || "title"}</div>
        {subtitle && <div className="popup_subtitle">{subtitle}</div>}
        <button
          className="popup_button"
          onClick={() => {
            if (dismiss) dismiss();
            if (buttonAction) buttonAction();
          }}
        >
          {buttonName || "confirm"}
        </button>
      </div>
    );
  }
}

export default OneButtonPopUp;
