import React, { Component } from "react";
import "./index.scss";

class PythonHintPopup extends Component {
  render() {
    const { title, imageUrl, cancelButtonName, dismiss } = this.props;
    return (
      <div className="popup_pythonImage">
        {/* <div className="popup_title">{title || "title"}</div> */}
        <div className="popup_buttons" style={{ display: "flex", flexFlow: "column" }}>
          <img src={imageUrl} style={{ width: "100%", height: "100%" }}></img>
          <button
            className="popup_button popup_button-cancel"
            onClick={() => {
              if (dismiss) dismiss();
            }}
          >
            {cancelButtonName || "cancel"}
          </button>
        </div>
      </div>
    );
  }
}

export default PythonHintPopup;
