import React, { Component, createRef } from "react";
import LinePolygon from "./LinePolygon";
import TerminationShape from "./TerminationShape";
import ArrowShape from "./ArrowShape";
import TextBox from "./TextBox";
import * as SocketUtil from "../../../../Page/Python/Component/util/pythonSocket";

export class Shapes extends Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.shapeProps.text, fontSize: 16 };
  }
  groupRef = createRef();
  shapeRef = createRef();
  trRef = createRef();
  textRef = createRef();

  componentDidMount() {
    // SocketUtil.socket.on(
    //   "syncUserBoard",
    //   async ({ message: { type, shapesInfo } }) => {
    //     const layer = this.props.layerRef.current;
    //     if (type === "changeText") {
    //       const group = layer.findOne(`#${shapesInfo.id}`);
    //       const [text] = group.getChildren(
    //         node => node.getClassName() === "Text"
    //       );
    //       text.setAttrs({ text: shapesInfo.shapeText });
    //       layer.draw();
    //     } else if (type === "changeScale") {
    //       const group = layer.findOne(`#${shapesInfo.id}`);
    //       group
    //         .getChildren(node => node.getClassName() !== "Transformer")
    //         .forEach(node => {
    //           if (node.getClassName() === "Text") {
    //             node.setAttrs({
    //               scale: shapesInfo.scale,
    //               x: shapesInfo.x,
    //               y: shapesInfo.y,
    //               width: shapesInfo.width,
    //               height: shapesInfo.height
    //             });
    //           } else {
    //             return node.setAttrs({
    //               scale: shapesInfo.scale,
    //               x: shapesInfo.x,
    //               y: shapesInfo.y
    //             });
    //           }
    //         });
    //       layer.draw();
    //     } else if (type === "changeCircle") {
    //       const { x, y } = shapesInfo.points;
    //       const circle = layer.findOne(`#${shapesInfo.id}`);
    //       circle.setAttrs({ x, y });
    //       layer.draw();
    //     }
    //   }
    // );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isSelected !== this.props.isSelected || prevProps.isSelectMode !== this.props.isSelectMode) {
      if (this.props.isSelected && this.props.isSelectMode)
        if (this.shapeRef.current && this.textRef.current) {
          this.trRef.current.nodes([this.shapeRef.current, this.textRef.current]);
          this.trRef.current.getLayer().draw();
          this.props.getShape(this.groupRef.current);
        } else if (this.textRef.current) {
          this.trRef.current.nodes([this.textRef.current]);
          this.trRef.current.getLayer().draw();
          this.props.getShape(this.groupRef.current);
        } else {
          this.props.getShape(this.groupRef.current);
        }
    }
  }

  createTextArea = () => {
    const textPosition = this.textRef.current.absolutePosition();
    const stageBox = this.props.stageRef.current.attrs.container.getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };
    const textarea = document.createElement("textarea");
    document.body.append(textarea);
    textarea.classList.add("flow_chart_textarea");
    textarea.value = this.props.shapeProps.text;
    textarea.style.top = areaPosition.y - 2 + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.position = "absolute";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.maxLength = "14";
    textarea.style.zIndex = "10";
    textarea.style.fontSize = this.textRef.current.fontSize() * this.textRef.current.scaleX() + "px";
    textarea.style.color = this.textRef.current.fill();
    textarea.style.width = this.textRef.current.width() * this.textRef.current.scaleX() + "px";
    textarea.style.height = this.textRef.current.height() * this.textRef.current.scaleY() + "px";
    textarea.style.lineHeight = this.textRef.current.lineHeight();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = this.textRef.current.align();
    textarea.focus();

    textarea.addEventListener("change", (e) => this.handleChangeText(e));

    textarea.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        this.textRef.current.text(textarea.value);
        removeTextarea();
        this.props.layerRef.current.draw();
      }
      if (e.keyCode === 27) {
        removeTextarea();
        this.props.layerRef.current.draw();
      }
    });

    textarea.addEventListener("keydown", (e) => {
      const scale = this.textRef.current.getAbsoluteScale().x;
      setTextareaWidth(this.textRef.current.width() * scale);
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + this.textRef.current.fontSize() + "px";
    });

    const removeTextarea = () => {
      const textarea = document.querySelector(".flow_chart_textarea");
      textarea.parentNode.removeChild(textarea);

      window.removeEventListener("click", handleOutsideClick);
      this.textRef.current.show();
      // tr.show();
      // tr.forceUpdate();
      this.props.layerRef.current.draw();
    };

    const setTextareaWidth = (newWidth) => {
      if (!newWidth) {
        newWidth = this.textRef.placeholder.length * this.textRef.fontSize();
      }
      textarea.style.width = newWidth + "px";
    };
    const handleOutsideClick = (e) => {
      if (e.target !== textarea) {
        this.textRef.current.text(textarea.value);
        removeTextarea();
        this.props.layerRef.current.draw();
      }
    };
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
  };

  handleDragStart = (e) => {
    if (e.target) {
      e.target.moveToTop();
      const children = e.target.getChildren(
        (node) => node.getClassName() === "Line" || node.getClassName() === "Shape",
      );
      children.setAttrs({
        shadowColor: "black",
        shadowBlur: 5,
        shadowOpacity: 0.6,
        shadowOffset: {
          x: 1,
          y: 1,
        },
      });
    }
  };

  handleDragEnd = (e) => {
    if (e.target) {
      const children = e.target.getChildren(
        (node) => node.getClassName() === "Line" || node.getClassName() === "Shape",
      );
      children.setAttrs({
        shadowBlur: 0,
        shadowOpacity: 0,
        shadowOffset: {
          x: 0,
          y: 0,
        },
      });
      // e.target.position({
      //   x: Math.round(e.target.x() / 24) * 24,
      //   y: Math.round(e.target.y() / 24) * 24
      // });
      this.props.layerRef.current.batchDraw();
      this.props.onChange({
        ...this.props.shapeProps,
        x: e.target.x(),
        y: e.target.y(),
      });

      SocketUtil.sendSocket("syncUserBoard", {
        type: "moveShape",
        shapesInfo: {
          id: e.target.id(),
          x: e.target.x(),
          y: e.target.y(),
        },
      });
    }
  };

  handleChangeText = (e) => {
    this.setState({ text: e.target.value });
    SocketUtil.sendSocket("syncUserBoard", {
      type: "changeText",
      shapesInfo: {
        id: this.groupRef.current.id(),
        shapeText: this.state.text,
      },
    });
  };

  render() {
    const { text, fontSize } = this.state;
    const { type, shapeProps, isSelected, isSelectMode, onSelect, onChange, stageRef, layerRef } = this.props;
    const { groupRef, shapeRef, trRef, textRef, createTextArea, handleDragStart, handleDragEnd, handleChangeText } =
      this;
    if (type === "terminal") {
      return (
        <TerminationShape
          layerRef={layerRef}
          groupRef={groupRef}
          shapeRef={shapeRef}
          textRef={textRef}
          trRef={trRef}
          shapeProps={shapeProps}
          onSelect={onSelect}
          onChange={onChange}
          isSelected={isSelected}
          isSelectMode={isSelectMode}
          createTextArea={createTextArea}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          text={text}
        />
      );
    } else if (type === "arrow") {
      return (
        <ArrowShape
          groupRef={groupRef}
          shapeRef={shapeRef}
          layerRef={layerRef}
          shapeProps={shapeProps}
          onSelect={onSelect}
          onChange={onChange}
          isSelected={isSelected}
          isSelectMode={isSelectMode}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
        />
      );
    } else if (type === "text") {
      return (
        <TextBox
          stageRef={stageRef}
          layerRef={layerRef}
          groupRef={groupRef}
          shapeRef={shapeRef}
          textRef={textRef}
          trRef={trRef}
          shapeProps={shapeProps}
          onSelect={onSelect}
          onChange={onChange}
          isSelected={isSelected}
          isSelectMode={isSelectMode}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          text={text}
          handleChangeText={handleChangeText}
          fontSize={fontSize}
        />
      );
    } else {
      return (
        <LinePolygon
          stageRef={stageRef}
          layerRef={layerRef}
          groupRef={groupRef}
          shapeRef={shapeRef}
          textRef={textRef}
          trRef={trRef}
          shapeProps={shapeProps}
          onSelect={onSelect}
          onChange={onChange}
          isSelected={isSelected}
          isSelectMode={isSelectMode}
          createTextArea={createTextArea}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          text={text}
        />
      );
    }
  }
}

export default Shapes;
