import React from "react";
import "./index.scss";

import board from "../../../../Image/python/board.svg";
// import board_active from "../../../../Image/python/board_active.svg";
import zoomin from "../../../../Image/python/zoom-in.svg";
import zoomout from "../../../../Image/python/zoom-out.svg";
import align from "../../../../Image/python/align.svg";

export default function (props) {
  const { handleRightButton, handleToggleThumbnail, userType } = props;
  return (
    <div className="Python__Rightbar" id="Python__Rightbar">
      <div style={{ margin: "0px -90px 0px 0px" }}>
        <div
          className="Rightbar_Board Board_NonActive"
          onClick={handleToggleThumbnail}
          style={{ pointerEvents: userType === "student" && "none" }}
        >
          <img id="LectureBoard_img" src={board} alt="img" />
        </div>
      </div>
      <div style={{ margin: "60vh 0px 0px 0px" }} id="Python__Rightbar2">
        <div className="Rightbar_ZoomIn">
          <img
            src={zoomin}
            alt="img"
            onClick={() => {
              handleRightButton("zoomIn");
            }}
          />
        </div>
        <div className="Rightbar_ZoomOut">
          <img
            src={zoomout}
            alt="img"
            onClick={() => {
              handleRightButton("zoomOut");
            }}
          />
        </div>
        <div className="Rightbar_Align">
          <img
            src={align}
            alt="img"
            onClick={() => {
              handleRightButton("align");
            }}
          />
        </div>
      </div>
    </div>
  );
}
