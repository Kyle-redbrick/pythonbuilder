import React, { Component, createRef } from "react";
import Konva from "konva";
import { Stage, Layer, Line } from "react-konva";
import { CirclePicker } from "react-color";
import uuid from "uuid";
import { showPopUp, TwoButtonPopUp } from "../../../../Common/Component/PopUp";
import Shapes from "./Components/Shapes";

import DecisionImg from "../../../../Image/Flowchart_Decision.svg";
import ProcessImg from "../../../../Image/Flowchart_Process.svg";
import IOImg from "../../../../Image/Flowchart_IO.svg";
import PreparationImg from "../../../../Image/Flowchart_Preparation.svg";
import ManualInputImg from "../../../../Image/Flowchart_manual_input.svg";
import ArrowImg from "../../../../Image/python/arrow.svg";
// import BoardEmptyImg from "../../../Image/python/board_empty_img.png";
import SelectImg from "../../../../Image/mouse_select.svg";
import TextImg from "../../../../Image/python/text.svg";
import TerminalImg from "../../../../Image/Flowchart_Terminal.svg";
import EraserImg from "../../../../Image/erase.svg";
import "./index.scss";
// import * as SocketUtil from "../../../PythonMonitor/Component/util/pythonSocket";

export class FlowChartTraining extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stageWidth: null,
      stageHeight: null,
      selectedId: null,
      currentShape: null,
      image: null,
      json: null,
      shapes: [],
      lines: [],
      isDrawing: false,
      isMouseDown: false,
      isSave: false,
      mode: "",
      shapeType: null,
      unlock: false,
    };
  }

  stageRef = createRef();
  layerRef = createRef();
  textRef = createRef();
  containerRef = createRef();
  toastRef = createRef();

  cursor = new Map([
    ["select", "flowChart__cursor__select"],
    ["pen", "flowChart__cursor__pen"],
    ["eraser", "flowChart__cursor__eraser"],
  ]);
  types = [
    {
      name: "arrow",
      src: ArrowImg,
      width: "100px",
      height: "100px",
      text: "화살표",
      points: null,
      color: "#777",
    },
    {
      name: "text",
      src: TextImg,
      width: "100px",
      height: "100px",
      text: "텍스트",
      points: null,
      color: "#333",
    },
    {
      name: "terminal",
      src: TerminalImg,
      width: "100px",
      height: "50px",
      text: "시작과 끝",
      points: null,
      color: "#f3325c",
    },
    {
      name: "preparation",
      src: PreparationImg,
      width: "100px",
      height: "50px",
      text: "초기화",
      points: [22, 0, 122, 0, 144, 24, 122, 48, 22, 48, 0, 24],
      color: "#fe8502",
    },
    {
      name: "process",
      src: ProcessImg,
      width: "100px",
      height: "50px",
      text: "처리",
      points: [0, 0, 144, 0, 144, 48, 0, 48],
      color: "#fecb00",
    },
    {
      name: "input_output",
      src: IOImg,
      width: "100px",
      height: "50px",
      text: "데이터 입출력",
      points: [22, 0, 144, 0, 120, 48, 0, 48],
      color: "#7cd421",
    },
    {
      name: "decision",
      src: DecisionImg,
      width: "100px",
      height: "50px",
      text: "조건",
      points: [72, 0, 144, 24, 72, 48, 0, 24],
      color: "#7753f9",
    },
    {
      name: "manual_input",
      src: ManualInputImg,
      width: "100px",
      height: "50px",
      text: "키보드 입력",
      points: [144, 0, 144, 48, 0, 48, 0, 15],
      color: "#16a4ed",
    },
  ];

  componentDidMount() {
    const container = this.containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    this.setState({ stageWidth: width, stageHeight: height });
    window.addEventListener("resize", this.handleCanvasSize);
    this.handleEventListener("mousedown");
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleCanvasSize);
    this.handleEventListener();
    this.saveLayer();
  }

  handleEventListener = (down) => {
    const stage = this.stageRef.current;
    if (down) {
      stage.addEventListener("mousedown", () => this.setState({ isMouseDown: true }));
      stage.addEventListener("mouseup", () => this.setState({ isMouseDown: false }));
    } else {
      stage.removeEventListener("mousedown", () => this.setState({ isMouseDown: true }));
      stage.removeEventListener("mouseup", () => this.setState({ isMouseDown: false }));
    }
  };

  handleCanvasSize = () => {
    const container = this.containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    this.setState({ stageWidth: width, stageHeight: height });
  };

  checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) this.setState({ selectedId: null, currentShape: null });
    this.startDrawing();
  };

  setShape = (type, points, text, color) => {
    const id = uuid.v4();
    const { x, y } = this.stageRef.current.getPointerPosition();
    if (type === "terminal") {
      const newShape = {
        x,
        y,
        fill: color,
        stroke: color,
        text: text,
        id: id,
        type: type,
        width: 144,
        height: 48,
        position: { x: 20, y: 20 },
      };
      this.setState({ shapes: [...this.state.shapes, newShape] });
    } else if (type === "arrow") {
      const newShape = {
        x,
        y,
        id: id,
        type: type,
        qs: { x: 0, y: 0 },
        qc: { x: 0, y: 50 },
        qe: { x: 0, y: 100 },
      };
      this.setState({
        shapes: [...this.state.shapes, newShape],
      });
    } else {
      const newShape = {
        x,
        y,
        points: points,
        fill: color,
        stroke: color,
        closed: true,
        text: text,
        id: id,
        type: type,
        width: 144,
        height: 48,
        position: { x: 20, y: 20 },
      };
      this.setState({ shapes: [...this.state.shapes, newShape] });
    }
  };

  getShape = (shape) => {
    this.setState({ currentShape: shape });
  };

  removeShape = () => {
    const shape = this.state.currentShape;
    if (!shape) return;
    this.setState({
      shapes: this.state.shapes.filter(({ id }) => id !== shape.id()),
    });
    this.layerRef.current.getChildren().forEach((node) => {
      if (node.getAttr("id") === shape.id()) {
        node.remove();
        this.updateLayer();
      }
    });
  };

  startDrawing = () => {
    if (this.state.mode === "pen") {
      this.setState({ isDrawing: true });
      const stage = this.stageRef.current;
      const pos = stage.getPointerPosition();

      this.lastLine = new Konva.Line({
        id: uuid.v4(),
        stroke: this.state.color,
        strokeWidth: 5.5,
        points: [pos.x, pos.y],
        bezier: true,
        lineJoin: "round",
        lineCap: "round",
      });
      this.layerRef.current.add(this.lastLine);
      this.setState({ lines: this.state.lines.concat([this.lastLine.attrs]) });
    }
  };

  moveDrawing = () => {
    if (!this.state.isDrawing) return;
    const pos = this.stageRef.current.getPointerPosition();
    const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
    this.lastLine.points(newPoints);
    this.updateLayer();
  };

  endDrawing = () => {
    if (this.state.mode === "pen") {
      this.setState({ isDrawing: false, lines: this.state.lines });
    }
  };

  removeLine = (e) => {
    if (this.state.mode === "eraser") {
      if (this.state.isMouseDown) {
        this.setState({
          lines: this.state.lines.filter((line) => line.id !== e.target.id()),
        });
        this.layerRef.current.getChildren().forEach((node) => {
          if (node.getClassName() === "Line") {
            if (node.getAttr("id") === e.target.id()) {
              node.destroy();
              this.updateLayer();
            }
          }
        });
      }
    }
  };

  handleChangeColor = (color) => {
    this.setState({ color: color.hex }, this.handleChangeMode("pen"));
  };

  handleChangeMode = (mode) => {
    this.setState({ mode });
  };

  updateLayer = () => {
    this.setState({ isSave: false });
    this.layerRef.current.draw();
  };

  resetLayer = () => {
    this.setState({ isSave: false });
    showPopUp(
      <TwoButtonPopUp
        title="모든 전체 화면을 지우시겠습니까?"
        subtitle="삭제된 화면은 복구할 수 없습니다."
        confirmButtonName="지우기"
        cancelButtonName="취소"
        confirmAction={() => {
          this.layerRef.current.clear();
          const children = this.layerRef.current.getChildren();
          if (children.length > 0) {
            this.layerRef.current.destroyChildren();
          }
          this.setState({ shapes: [], lines: [] });
          localStorage.clear();
        }}
      />,
    );
  };

  saveLayer = () => {
    this.setState({ isSave: true });
    const stage = this.stageRef.current;
    this.showToastNotification();
    stage.toImage({
      callback: (img) => this.props.getBoardThumbnail(img.src),
      MimeType: "image/png",
    });
  };

  closeLayer = () => {
    if (this.state.isSave) {
      this.props.handleToggleBoard();
    } else {
      showPopUp(
        <TwoButtonPopUp
          title="칠판을 나가시겠습니까?"
          confirmButtonName="저장하기"
          cancelButtonName="머무르기"
          confirmAction={() => {
            this.saveLayer();
            setTimeout(() => {
              this.props.handleToggleBoard();
            }, 1000);
          }}
        />,
      );
    }
  };

  showToastNotification = () => {
    const snackbar = this.toastRef.current;
    if (!snackbar) {
      return;
    } else {
      snackbar.style.right = `${this.state.stageWidth * 0.5 - 161.5}px`;
      snackbar.className += " flowChart__toast__on";
      setTimeout(() => {
        snackbar.className = snackbar.className.replace("flowChart__toast__on", "");
      }, 3000);
    }
  };

  toggleTrashActive = () => {
    if (this.state.currentShape) {
      const trash = document.querySelector(".flowChart__trash");
      trash.classList.toggle("flowChart__trash__on");
      const className = "flowChart__tras__on";
      this.state.currentShape.opacity(+`${trash.className.includes(className) ? 0.5 : 1}`);
    }
  };

  render() {
    const {
      checkDeselect,
      setShape,
      endDrawing,
      moveDrawing,
      handleChangeColor,
      removeShape,
      handleChangeMode,
      removeLine,
      getShape,
      resetLayer,
      saveLayer,
      toggleTrashActive,
      types,
      cursor,
      closeLayer,
      containerRef,
      toastRef,
      stageRef,
      layerRef,
      textRef,
    } = this;
    const { stageWidth, stageHeight, selectedId, shapes, lines, color, mode, shapeType } = this.state;

    return (
      <div className="flowChart__page">
        <div className="flowChart__overlay">
          <div className="flowChart__container">
            <aside className="flowChart__menu">
              <div className="flowChart__menu__top">
                <div className="flowChart__menu__title">
                  <h3>메뉴</h3>
                </div>
                <div className="flowChart__box">
                  <div className="flowChart__item">
                    <h5>선택(이동)</h5>
                    <div className="flowChart__icon" value="select" onClick={() => handleChangeMode("select")}>
                      <img src={SelectImg} alt="select" draggable="false" />
                    </div>
                  </div>
                  <hr />
                  <div className="flowChart__item">
                    <h5>펜</h5>
                    <CirclePicker
                      color={color}
                      onChangeComplete={handleChangeColor}
                      colors={[
                        "#ffffff",
                        "#000000",
                        "#d93131",
                        "#e1843d",
                        "#ede93c",
                        "#92e74a",
                        "#4fbfd9",
                        "#4a46d9",
                        "#945adf",
                        "#df6bcb",
                      ]}
                      circleSize={20}
                      circleSpacing={10}
                    />
                  </div>
                  <hr />
                  <div className="flowChart__item">
                    <h5>지우개</h5>
                    <div className="flowChart__icon" onClick={() => handleChangeMode("eraser")}>
                      <img src={EraserImg} alt="eraser" draggable="false" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flowChart__menu__bottom">
                <div className="flowChart__menu__title">
                  <h3>순서도</h3>
                </div>
                <div className="flowChart__grid">
                  {types.map(({ name, src, width, height, text }) => (
                    <div key={name}>
                      <img
                        src={src}
                        alt={name}
                        width={width}
                        height={height}
                        draggable="true"
                        onDragStart={(e) => {
                          this.setState({
                            shapeType: e.target.alt,
                            selectedId: null,
                          });
                        }}
                      />
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
            <main
              className="flowChart__main"
              ref={containerRef}
              onDrop={(e) => {
                stageRef.current.setPointersPositions(e);
                types.forEach(({ name, points, text, color }) =>
                  name === shapeType ? setShape(name, points, text, color) : null,
                );
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="flowChart__close" onClick={closeLayer} />
              <div className="flowChart__toast" ref={toastRef}>
                <span>현재 이미지가 썸네일로 지정되었습니다.</span>
              </div>
              <div className="flowChart__pin" onClick={saveLayer} />
              <div className="flowChart__reset" onClick={resetLayer} />
              <div
                className="flowChart__trash"
                onMouseUp={removeShape}
                onMouseOver={toggleTrashActive}
                onMouseLeave={toggleTrashActive}
              />
              <Stage
                className={`${cursor.get(mode)}`}
                width={stageWidth}
                height={stageHeight}
                onMouseDown={checkDeselect}
                onMouseUp={endDrawing}
                onMouseMove={(e) => moveDrawing(e)}
                ref={stageRef}
              >
                <Layer className="flowChart__layer" ref={layerRef} onMouseMove={removeLine}>
                  {lines.map((line) => (
                    <Line key={line.id} {...line} />
                  ))}
                  {shapes.map(({ id, x, y, type, ...shapeProps }) => {
                    return (
                      <Shapes
                        className="flowChart__shape"
                        key={id}
                        type={type}
                        shapeProps={{
                          ...shapeProps,
                          x,
                          y,
                          id,
                        }}
                        isSelected={id === selectedId}
                        isSelectMode={mode === "select"}
                        onSelect={() => {
                          this.setState({
                            selectedId: id,
                          });
                        }}
                        onChange={(newAttrs) => {
                          this.setState(
                            this.state.shapes
                              .filter((shape) => shape.id === selectedId)
                              .map((shape) => ({ ...shape, ...newAttrs })),
                          );
                        }}
                        getShape={getShape}
                        stageRef={stageRef}
                        layerRef={layerRef}
                        textRef={textRef}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default FlowChartTraining;
