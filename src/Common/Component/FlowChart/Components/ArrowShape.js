import React, { Component, createRef } from "react";
import { Circle, Shape, Line, Group } from "react-konva";
import * as SocketUtil from "../../../../Page/Python/Component/util/pythonSocket";

export class ArrowShape extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shape: null,
    };
  }
  quadStart = createRef();
  quadControl = createRef();
  quadEnd = createRef();

  componentDidMount() {
    const findAngle = (sx, sy, ex, ey) => {
      return Math.atan2(ey - sy, ex - sx);
    };
    const shape = (
      <Shape
        stroke="#777777"
        strokeWidth={4}
        shapeRef={this.props.shapeRef}
        onClick={this.props.onSelect}
        sceneFunc={(ctx, shape) => {
          const qsx = this.quadStart.current.x();
          const qsy = this.quadStart.current.y();
          const qcx = this.quadControl.current.x();
          const qcy = this.quadControl.current.y();
          const qex = this.quadEnd.current.x();
          const qey = this.quadEnd.current.y();
          const angle = findAngle(qcx, qcy, qex, qey);

          ctx.beginPath();
          ctx.moveTo(qsx, qsy);
          ctx.quadraticCurveTo(qcx, qcy, qex, qey);
          ctx.moveTo(qex, qey);
          ctx.lineTo(qex - 10 * Math.cos(angle + Math.PI / 6), qey - 10 * Math.sin(angle + Math.PI / 6));
          ctx.moveTo(qex, qey);
          ctx.lineTo(qex - 10 * Math.cos(angle - Math.PI / 6), qey - 10 * Math.sin(angle - Math.PI / 6));

          ctx.lineCap = "round";
          ctx.fillStrokeShape(shape);
        }}
      />
    );
    this.setState({ shape });
  }

  updateDottedLines = (layer) => {
    const quadLinePath = layer.findOne(`#${this.props.shapeProps.id}_line`);
    quadLinePath.points([
      this.quadStart.current.x(),
      this.quadStart.current.y(),
      this.quadControl.current.x(),
      this.quadControl.current.y(),
      this.quadEnd.current.x(),
      this.quadEnd.current.y(),
    ]);
    layer.draw();
  };

  handleChangeCircle = (quad, circle) => {
    SocketUtil.sendSocket("syncUserBoard", {
      type: "changeCircle",
      shapesInfo: {
        id: this.props.groupRef.current.id(),
        points: {
          x: quad.current.x(),
          y: quad.current.y(),
        },
        circle,
      },
    });
  };

  render() {
    const {
      layerRef,
      shapeProps,
      // onChange,
      isSelected,
      isSelectMode,
      onSelect,
      // shapeRef,
      groupRef,
      handleDragEnd,
      handleDragStart,
    } = this.props;
    const { shape } = this.state;
    const { quadStart, quadControl, quadEnd, updateDottedLines, handleChangeCircle } = this;
    return (
      <Group
        ref={groupRef}
        x={shapeProps.x}
        y={shapeProps.y}
        id={shapeProps.id}
        onClick={onSelect}
        onDragStart={(e) => handleDragStart(e)}
        onDragEnd={(e) => handleDragEnd(e)}
        draggable={isSelectMode}
      >
        <Line
          dash={[5, 5, 5, 5]}
          strokeWidth={3}
          stroke="#1db6ff"
          lineCap="round"
          id={`${shapeProps.id}_line`}
          opacity={0.3}
          points={[0, 0]}
        />
        <Circle
          ref={quadStart}
          x={shapeProps.qs.x}
          y={shapeProps.qs.y}
          radius={5.5}
          stroke={isSelected && isSelectMode ? "#1db6ff" : "transparent"}
          fill={isSelected && isSelectMode ? "#1db6ff" : "transparent"}
          strokeWidth={2}
          draggable
          onDragMove={() => updateDottedLines(layerRef.current)}
          onDragEnd={() => handleChangeCircle(quadStart, "qs")}
        />
        <Circle
          ref={quadControl}
          x={shapeProps.qc.x}
          y={shapeProps.qc.y}
          radius={5.5}
          stroke={isSelected && isSelectMode ? "#1db6ff" : "transparent"}
          fill={isSelected && isSelectMode ? "#1db6ff" : "transparent"}
          strokeWidth={2}
          draggable
          onDragMove={() => updateDottedLines(layerRef.current)}
          onDragEnd={() => handleChangeCircle(quadControl, "qc")}
        />
        <Circle
          ref={quadEnd}
          x={shapeProps.qe.x}
          y={shapeProps.qe.y}
          radius={5.5}
          stroke={isSelected && isSelectMode ? "#1db6ff" : "transparent"}
          fill={isSelected && isSelectMode ? "#1db6ff" : "transparent"}
          strokeWidth={2}
          draggable
          onDragMove={() => updateDottedLines(layerRef.current)}
          onDragEnd={() => handleChangeCircle(quadEnd, "qe")}
        />
        {shape}
      </Group>
    );
  }
}

export default ArrowShape;
