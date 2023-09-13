import React from "react";
import "./index.scss";

export default function View({ localVideoRef, remoteVideoRef }) {
  return (
    <div className="Python_Camera" id="Python_Camera">
      <div className="Camera_Content">
        <div className="Camera_Header">화상 수업</div>
        <div className="Camera_Videos">
          <div className="RemoteVideo" id="remoteVideo" ref={remoteVideoRef} />
          <div className="LocalVideo" id="localVideo" ref={localVideoRef} />
        </div>
      </div>
    </div>
  );
}
