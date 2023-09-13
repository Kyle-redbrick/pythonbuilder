import React, { Component } from "react";
import "./index.scss";

class VideoPopUp extends Component {
  render() {
    const { src, dismiss } = this.props;
    return (
      <div className="popup_video">
        <video playsInline controls autoPlay={true}>
          {src && <source src={src} />}
        </video>
        <div className="popup_video_close" onClick={dismiss}>
          <p className="popup_video_close_image" />
          닫기
        </div>
      </div>
    );
  }
}

export default VideoPopUp;
