import React, { Component } from "react";
import "./index.scss";

class TwoButtonPopUp extends Component {
  render() {
    const { title, subtitle, cancelButtonName, confirmButtonName, confirmAction, dismiss } = this.props;
    return (
      <div className="popup_twobutton">
        <div className="popup_title">{title || "title"}</div>
        {subtitle && <div className="popup_subtitle">{subtitle}</div>}
        <div className="popup_buttons">
          <button
            className="popup_button popup_button-cancel"
            onClick={() => {
              if (dismiss) dismiss();
            }}
          >
            {cancelButtonName || "cancel"}
          </button>
          <button
            className="popup_button"
            onClick={() => {
              if (dismiss) dismiss();
              if (confirmAction) confirmAction();
            }}
          >
            {confirmButtonName || "confirm"}
          </button>
        </div>
      </div>
    );
  }
}

export default TwoButtonPopUp;
