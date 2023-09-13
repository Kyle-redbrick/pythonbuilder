import React from "react";
import { Line, Transformer, Text, Group } from "react-konva";

const LinePolygon = ({
  onSelect,
  shapeRef,
  shapeProps,
  isSelected,
  isSelectMode,
  trRef,
  textRef,
  groupRef,
  layerRef,
  createTextArea,
  handleDragEnd,
  handleDragStart,
}) => {
  const {
    closed,
    fill,
    points,
    stroke,
    text,
    position,
    width,
    height,
    // scale,
    ...rest
  } = shapeProps;
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
      <Line
        x={position.x}
        y={position.y}
        ref={shapeRef}
        // scale={scale}
        closed
        fill={fill}
        points={points}
        stroke={stroke}
      />
      <Text
        ref={textRef}
        x={position.x}
        y={position.y}
        width={width}
        height={height}
        // scale={scale}
        text={text}
        fontSize={14}
        fill="#333333"
        align="center"
        verticalAlign="middle"
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
      {isSelected && isSelectMode && (
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
        />
      )}
    </Group>
  );
};

export default LinePolygon;
