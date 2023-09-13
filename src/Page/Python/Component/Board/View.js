import React from "react";
import "./index.scss";

export default function View(props) {
  const { handleToggleBoard, handleToggleThumbnail, thumbnail, userType } = props;
  return (
    <div className="python__board" id="python__board">
      <div className="board__container">
        <div className="board__header">
          <h3 className="board__title">칠판</h3>
          <div
            className="board__header--close"
            onClick={handleToggleThumbnail}
            style={{ pointerEvents: userType === "student" && "none" }}
          />
        </div>
        <div className="board__main">
          <img src={thumbnail} alt="board_img" />
          <div
            className="board__main--open"
            onClick={handleToggleBoard}
            style={{ pointerEvents: userType === "student" && "none" }}
          />
        </div>
      </div>
    </div>
  );
}
