import React from "react";
import { Transformer, Group, Text, Shape } from "react-konva";
import * as SocketUtil from "../../../../Page/Python/Component/util/pythonSocket";

const TerminationShape = ({
  onSelect,
  shapeRef,
  shapeProps,
  // onChange,
  isSelected,
  isSelectMode,
  textRef,
  trRef,
  groupRef,
  layerRef,
  createTextArea,
  handleDragStart,
  handleDragEnd,
  // text
}) => {
  const { closed, fill, points, stroke, text, position, width, height, scale, ...rest } = shapeProps;

  return (
    <Group
      ref={groupRef}
      x={rest.x}
      y={rest.y}
      id={rest.id}
      onClick={onSelect}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={(e) => handleDragEnd(e)}
      draggable={isSelectMode}
    >
      <Shape
        x={position.x}
        y={position.y}
        onClick={onSelect}
        ref={shapeRef}
        closed
        fill={fill}
        points={points}
        stroke={stroke}
        width={144}
        height={48}
        scale={!scale ? { x: 1, y: 1 } : scale}
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(22, 0);
          context.lineTo(120, 0);
          context.arc(120, 24, 24, (Math.PI * 6) / 4, Math.PI / 2);
          context.lineTo(22, 48);
          context.arc(22, 24, 24, (Math.PI * -6) / 4, (Math.PI * -1) / 2);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
      />
      <Text
        ref={textRef}
        x={position.x}
        y={position.y}
        width={width}
        height={height}
        scale={!scale ? { x: 1, y: 1 } : scale}
        text={text}
        fontSize={14}
        align="center"
        verticalAlign="middle"
        fill="#333333"
        onDblClick={() => {
          if (isSelected && isSelectMode) {
            if (trRef.current) {
              textRef.current.hide();
              trRef.current.hide();
              layerRef.current.draw();
              createTextArea();
            } else {
              textRef.current.hide();
              layerRef.current.draw();
              createTextArea();
            }
          }
        }}
      />
      {isSelected &&
        isSelectMode &&
        (() => {
          return (
            <Transformer
              ref={trRef}
              anchorStroke="#1db6ff"
              anchorFill="#1db6ff"
              anchorSize={8}
              borderStroke="#1db6ff"
              borderStrokeWidth={1}
              anchorCornerRadius={2}
              enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
              rotateEnabled={false}
              boundBoxFunc={(oldBox, newBox) => {
                // limit resize
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
              onTransformEnd={() => {
                const group = groupRef.current;
                const text = textRef.current;
                const shape = shapeRef.current;
                SocketUtil.sendSocket("syncUserBoard", {
                  type: "changeScale",
                  shapesInfo: {
                    id: group.id(),
                    x: text.x(),
                    y: text.y(),
                    width: shape.width(),
                    height: shape.height(),
                    scale: text.getAbsoluteScale(),
                  },
                });
              }}
            />
          );
        })()}
    </Group>
  );
};

export default TerminationShape;
