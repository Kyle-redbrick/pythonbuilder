import React, { Component } from "react";
import { connect } from "react-redux";
import * as socketUtil from "../util/pythonSocket";
import { showPopUp, PythonHIntPopup } from "../../../../Common/Component/PopUp";
import View from "./View";
import { NotificationManager } from "react-notifications";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = { foldFlag: false, execFlag: false, terminalText: "결과" };
    // let before_height_editor = 0;
    // let before_height_bottom = 0;
  }

  componentDidMount() {
    this.dragElement(document.querySelector("#Menu_Resize"));

    socketUtil.socket.on("resultRequsetRunPython", (data) => {
      let consoleText = null;
      if (data.result) {
        NotificationManager.success("실행되었습니다.", "", 2000);
        const reuslt = JSON.stringify(data.data);
        if (reuslt.includes("WIZ_PY_CV2_LIB") || reuslt.includes("WIZ_PY_PLT_LIB")) {
          let url = "";
          let result = "";
          data.data.map((item) => {
            if (item.includes("WIZ_PY_CV2_LIB") || item.includes("WIZ_PY_PLT_LIB")) {
              url = item.split(" ")[1];
            } else {
              result += item + "\n";
            }
          });
          let resultText = (
            <>
              {result}
              <div
                className="Menu_Execute"
                onClick={() => {
                  showPopUp(<PythonHIntPopup title="힌트" imageUrl={url} cancelButtonName="닫기" />);
                }}
              >
                결과확인
              </div>
            </>
          );

          this.setTerminal(resultText);
        } else {
          Array.isArray(data.data) ? (consoleText = data.data.join("\n")) : (consoleText = "결과가 없습니다.");
          // let resultText = `>>> ` + consoleText;
          let resultText = `` + consoleText;
          this.setTerminal(resultText);
        }
      } else {
        NotificationManager.warning("결과가 없습니다.", "", 2000);
        data.data ? this.setTerminal(data.data) : this.setTerminal(" 결과가 없습니다.");
        // : this.setTerminal(">>>> 결과가 없습니다.");
      }
    });
  }

  handleBottomButton = (type) => {
    if (type === "exec") {
      this.ace = window.ace;
      this.aceEditor = this.ace.edit("Python__Editor");
      let pyCode = this.aceEditor.getValue();

      pyCode = `password = 2020 \n` + pyCode;
      socketUtil.sendSocket("requsetRunPython", pyCode);
    } else if (type === "reset") {
      NotificationManager.info("초기화되었습니다.", "", 2000);
      this.setState({ execFlag: false, terminalText: "결과" });
    }
  };

  setTerminal = (value) => {
    this.setState({ execFlag: true, terminalText: value });
  };

  handleBottomFold = () => {
    let pythonEditor = document.getElementById("Python__Editor");
    let leftWidthBar = document.getElementById("TabWidthBarButton");
    let bottomBar = document.getElementById("Python__Bottombar");
    let bottomResult = document.getElementById("Bottombar_Result");
    let pythonRight = document.getElementById("Python__Rightbar");

    this.setState({ foldFlag: !this.state.foldFlag });

    if (!this.state.foldFlag) {
      this.before_height_editor = pythonEditor.clientHeight;
      this.before_height_bottom = bottomBar.clientHeight;

      let foldSize = window.innerHeight - 88;
      pythonEditor.style.height = foldSize + "px";
      leftWidthBar.style.height = foldSize + "px";
      bottomBar.style.height = "56px";
      bottomResult.style.display = "none";
      pythonRight.style.height = foldSize + "px";
    } else {
      pythonEditor.style.height = this.before_height_editor + "px";
      leftWidthBar.style.height = this.before_height_editor + "px";
      bottomBar.style.height = this.before_height_bottom + "px";
      bottomResult.style.display = "block";
      pythonRight.style.height = window.innerHeight - 88 - this.before_height_bottom + "px";
    }
    window.ace.edit("Python__Editor").resize();
  };

  dragElement = (elmnt) => {
    if (document.getElementById(elmnt.id)) {
      document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      document.onmousemove = elementDrag;
      document.onmouseup = closeDragElement;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // 88 = header's height + Bottombar_MenuList's height
      let pos1 = window.innerHeight - e.clientY + 88;
      let pos2 = window.innerHeight - pos1;

      if ((pos1 / window.innerHeight) * 100 < 15 || (pos1 / window.innerHeight) * 100 > 40) return;

      let pythonEditor = document.getElementById("Python__Editor");
      let leftWidthBar = document.getElementById("TabWidthBarButton");
      let pythonBottom = document.getElementById("Python__Bottombar");
      let pythonRight = document.getElementById("Python__Rightbar");
      let pythonRight2 = document.getElementById("Python__Rightbar2");

      pythonEditor.style.height = pos2 + "px";
      leftWidthBar.style.height = pos2 + "px";
      pythonBottom.style.height = pos1 - 32 + "px";
      pythonRight.style.height = pos2 + "px";
      pythonRight2.style.marginTop = pos2 - 265 + "px";

      window.ace.edit("Python__Editor").resize();
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };

  render() {
    const { foldFlag, execFlag, terminalText } = this.state;
    const { handleBottomButton, handleBottomFold } = this;
    return (
      <View
        foldFlag={foldFlag}
        execFlag={execFlag}
        terminalText={terminalText}
        handleBottomButton={handleBottomButton}
        handleBottomFold={handleBottomFold}
      />
    );
  }
}

export default connect((state) => ({ email: state.userinfo.email }))(Container);
