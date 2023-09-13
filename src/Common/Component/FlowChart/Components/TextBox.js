import React from "react";
import { Group, Text, Transformer } from "react-konva";
import * as SocketUtil from "../../../../Page/Python/Component/util/pythonSocket";

const TextBox = ({
  onSelect,
  // shapeRef,
  shapeProps,
  // onChange,
  isSelected,
  isSelectMode,
  trRef,
  textRef,
  groupRef,
  layerRef,
  stageRef,
  handleDragEnd,
  handleDragStart,
  // text,
  handleChangeText,
  fontSize,
}) => {
  const { closed, fill, points, stroke, text, position, width, scale, ...rest } = shapeProps;
  // let handleChangeShape = onChange;

  const createTextArea = () => {
    let _textRef = textRef;
    const textPosition = _textRef.current.absolutePosition();
    const stageBox = stageRef.current.attrs.container.getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };
    const textarea = document.createElement("textarea");
    document.body.append(textarea);
    textarea.classList.add("flow_chart_textarea");
    textarea.value = text;
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.position = "absolute";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.zIndex = "10";
    textarea.style.fontSize = _textRef.current.fontSize() * _textRef.current.scaleX() + "px";
    textarea.style.color = _textRef.current.fill();
    textarea.style.width = _textRef.current.width() * _textRef.current.scaleX() + "px";
    textarea.style.height = _textRef.current.height() * _textRef.current.scaleY() + "px";
    textarea.style.lineHeight = _textRef.current.lineHeight();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = _textRef.current.align();
    textarea.focus();

    textarea.addEventListener("change", (e) => {
      handleChangeText(e);
    });

    textarea.addEventListener("keydown", (e) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        _textRef.current.text(textarea.value);
        removeTextarea();
        layerRef.current.draw();
      }
      if (e.keyCode === 27) {
        removeTextarea();
        layerRef.current.draw();
      }
    });

    textarea.addEventListener("keydown", (e) => {
      const scale = _textRef.current.getAbsoluteScale().x;
      setTextareaWidth(_textRef.current.width() * scale);
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + _textRef.current.fontSize() + "px";
    });

    const removeTextarea = () => {
      const textarea = document.querySelector(".flow_chart_textarea");
      textarea.parentNode.removeChild(textarea);

      window.removeEventListener("click", handleOutsideClick);
      _textRef.current.show();
      // tr.show();
      // tr.forceUpdate();
      layerRef.current.draw();
    };

    const setTextareaWidth = (newWidth) => {
      if (!newWidth) {
        newWidth = _textRef.current.placeholder.length() * _textRef.current.fontSize();
      }
      textarea.style.width = newWidth + "px";
    };
    const handleOutsideClick = (e) => {
      if (e.target !== textarea) {
        _textRef.current.text(textarea.value);
        removeTextarea();
        layerRef.current.draw();
      }
    };
    setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    });
  };

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
      <Text
        ref={textRef}
        x={20}
        y={20}
        width={width}
        scale={!scale ? { x: 1, y: 1 } : scale}
        text={text}
        fontSize={+fontSize}
        fill={fill}
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
          onTransformEnd={() => {
            const group = groupRef.current;
            const text = textRef.current;
            SocketUtil.sendSocket("syncUserBoard", {
              type: "changeScale",
              shapesInfo: {
                id: group.id(),
                x: text.x(),
                y: text.y(),
                width: text.width(),
                scale: text.getAbsoluteScale(),
              },
            });
          }}
        />
      )}
    </Group>
  );
};

export default TextBox;
