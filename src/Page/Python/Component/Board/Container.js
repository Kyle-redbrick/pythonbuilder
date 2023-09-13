import React, { Component } from "react";
import View from "./View";

class Container extends Component {
  componentDidMount() {
    const pythonBoard = document.querySelector("#python__board");
    if (pythonBoard) {
      this.dragElement(pythonBoard);
    }
  }

  dragElement = (elmnt) => {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    if (document.getElementById(elmnt.id)) {
      document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();

      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      const boardContainer = document.querySelector(".board__container");
      const { x: boardX, y: boardY, width: boardWidth } = boardContainer.getBoundingClientRect();
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight - boardContainer.clientHeight;

      if (boardX >= 5 && boardX <= maxWidth - boardWidth - 5) {
        let result_left = boardX - pos1;
        elmnt.style.left = (result_left / maxWidth) * 100 + "%";
      } else {
        let result_left = 0;
        !(boardX >= 5) ? (result_left = boardX + Math.abs(pos1)) : (result_left = boardX - Math.abs(pos1));
        elmnt.style.left = (result_left / maxWidth) * 100 + "%";
      }

      if (boardY >= 5 && boardY <= maxHeight - 10) {
        let result_top = boardY - pos2;
        elmnt.style.top = (result_top / window.innerHeight) * 100 + "%";
      } else {
        let result_top = 0;
        !(boardY >= 5) ? (result_top = boardY + Math.abs(pos2)) : (result_top = boardY - Math.abs(pos2));
        elmnt.style.top = (result_top / window.innerHeight) * 100 + "%";
      }
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  render() {
    const { handleToggleBoard, handleToggleThumbnail, thumbnail, userType } = this.props;
    return (
      <View
        handleToggleBoard={handleToggleBoard}
        handleToggleThumbnail={handleToggleThumbnail}
        thumbnail={thumbnail}
        userType={userType}
      />
    );
  }
}

export default Container;
