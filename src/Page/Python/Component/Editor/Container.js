import React, { Component } from "react";
import { connect } from "react-redux";
import View from "./View";
import * as socketUtil from "../util/pythonSocket";
import stringify from "json-stringify-safe";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.beforeRange = undefined;
    this.ace = window.ace;
    this.aceEditor = undefined;
    this.undoManagers = {};
    this.tempEditor = null;
    this.sync = false;
    this.autoCompleteApiList = [];
    this.langTools = this.ace.require("ace/ext/language_tools"); // 얘가 문제다
  }
  async componentDidMount() {
    console.log("ace", window.ace);
    document.addEventListener("mousedown", this.inputEventListener, true);
    document.addEventListener("keydown", this.inputEventListener, true);
    this.setAceEditor();
    this.setDefaultsize();

    socketUtil.socket.on("syncUserCode", (data) => {
      if (!this.sync) {
        this.aceEditor.setValue(data.code, 1);
        this.aceEditor.moveCursorTo(data.row, data.column);
      }

      // code syntax error checking
      if (this.PYEvaluatorTimer) {
        clearTimeout(this.PYEvaluatorTimer);
      }
      this.PYEvaluatorTimer = setTimeout(() => {
        socketUtil.sendSocket("syntaxCheck", this.aceEditor.getValue());
      }, 1500);
    });

    // sync user cursor location (tutor, student)
    socketUtil.socket.on("syncUserCursor", (data) => {
      if (data.message.userType === this.props.userType) return;
      if (this.beforeRange === data.message.range) return;
      if (
        stringify(data.message.range.end) ===
        stringify(data.message.range.start)
      ) {
        this.aceEditor.selection.clearSelection();
        this.aceEditor.selection.moveCursorToPosition(data.message.range.end);
      } else {
        this.aceEditor.selection.setRange(data.message.range);
      }
    });

    // sync code annotations
    socketUtil.socket.on("syntaxCheckResult", (data) => {
      let annotations = [];

      let lineLocation;
      if (data.line === "NaN") {
        let cursor = this.getSelectionRange();
        lineLocation = cursor.end.row;
      } else {
        lineLocation = data.line;
      }

      if (!data.result) {
        annotations.push({
          // row: data.line,
          row: lineLocation,
          coloumn: 0,
          text: data.message,
          type: "error",
        });
        window.ace
          .edit("Python__Editor")
          .getSession()
          .setAnnotations(annotations);
      } else {
        window.ace
          .edit("Python__Editor")
          .getSession()
          .setAnnotations(annotations);
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.inputEventListener);
    document.removeEventListener("keydown", this.inputEventListener);
  }

  setDefaultsize = () => {
    let pythonEditor = document.getElementById("Python__Editor");
    let pythonBottom = document.getElementById("Python__Bottombar");

    let editorWidth = window.innerWidth - 24;
    let bottomWidth = window.innerWidth;

    let editorWidthOfpercent = (editorWidth / window.innerWidth) * 100;
    let bottomWidthOfpercent = (bottomWidth / window.innerWidth) * 100;

    pythonEditor.style.width = editorWidthOfpercent - 30 + "%";
    pythonBottom.style.width = bottomWidthOfpercent - 30 + "%";
    pythonBottom.style.height =
      window.innerHeight - pythonEditor.clientHeight - 32 + "px";
  };

  // user key insert(down event) detect and allow to socket send
  inputEventListener = (evt) => {
    if (this.props.userType === "tutorTraining") return;

    this.sync = true;
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    this.syncTimeout = setTimeout(() => {
      this.sync = false;
    }, 2000);

    if (this.testKor) clearTimeout(this.testKor);
    if (evt.keyCode === 229) {
      if (this.testKor) {
        clearTimeout(this.testKor);
      }
      this.testKor = setTimeout(() => {
        this.aceEditor.blur();
        this.aceEditor.focus();
      }, 1000);
    }
  };

  setAceEditor() {
    this.aceEditor = this.ace.edit("Python__Editor");
    this.aceEditor.session.setMode(`ace/mode/python`);
    this.aceEditor.setTheme("ace/theme/wizschool");

    this.aceEditor.setOption("highlightActiveLine", true);
    this.aceEditor.setOption("highlightSelectedWord", true);
    this.aceEditor.setOption("showPrintMargin", true);

    this.aceEditor.on("changeSelection", this.handleOnChangeSelection);
    this.aceEditor.on("change", this.handleOnChange);
    // this.aceEditor.on("mousemove", this.handleMousemove);

    document
      .getElementById("Python__Editor")
      .addEventListener("mouseout", () => {
        // document.getElementById("EditorContainer_tooltip").style.display = "none";
      });
    this.aceEditor.getSession().setUseWrapMode(false);
    this.aceEditor.setFontSize(16);
    this.aceEditor.container.style.lineHeight = 2;
    this.undoManagers.defaultManager = this.aceEditor.session.getUndoManager();
    this.aceEditor.setOptions({
      enableBasicAutocompletion: false,
      enableSnippets: false,
      enableLiveAutocompletion: false,
    });

    // auto completer list setting
    // this.setAutoCompleters();

    this.aceEditor.session.on("changeMode", function (e, session) {
      if (`ace/mode/python` === session.getMode().$id) {
        if (!!session.$worker) {
          session.$worker.send("setOptions", [
            {
              "-W041": false,
              "-W033": false,
              "-W104": false,
              "-W118": false,
            },
          ]);
        }
      }
    });

    // this.aceEditor.setValue(this.props.currentCode);
    // this.aceEditor.moveCursorTo(4, 1);
    // this.aceEditor.clearSelection();

    if (this.props.userType === "pySpring") {
      if (localStorage.getItem("pySpringCode")) {
        this.aceEditor.setValue(localStorage.getItem("pySpringCode"));
      } else {
        this.aceEditor.setValue(this.props.currentCode);
      }
    } else {
      this.aceEditor.setValue(this.props.currentCode);
    }

    this.aceEditor.moveCursorTo(4, 1);
    this.aceEditor.clearSelection();
  }

  // user change select(cusor) detect
  handleOnChangeSelection = (event, editor) => {
    let range = this.getSelectionRange();
    if (
      editor.curOp &&
      editor.curOp.selectionChanged &&
      editor.curOp.command.name
    ) {
      this.beforeRange = range;
      socketUtil.sendSocket("syncUserCursor", {
        userType: this.props.userType,
        range: range,
      });
    } else {
      return;
    }
  };

  // user edit text detect
  handleOnChange = (event, editor) => {
    if (editor.curOp && editor.curOp.command.name) {
      const code = editor.getValue();
      this.props.handleGetCodeData(code);
      let _row, _column;
      if (event.action === "remove") {
        _row = event.start.row;
        _column = event.start.column;
      } else {
        _row = event.end.row;
        _column = event.end.column;
      }

      // 확인 필요
      if (this.sync) {
        socketUtil.sendSocket("syncUserCode", {
          code: code,
          row: _row,
          column: _column,
          lines: event.lines[0],
          actionType: event.action,
        });
      } else {
        if (this.PYEvaluatorTimer) {
          clearTimeout(this.PYEvaluatorTimer);
        }
        this.PYEvaluatorTimer = setTimeout(() => {
          socketUtil.sendSocket("syntaxCheck", this.aceEditor.getValue());
        }, 1500);
      }
    }

    if (this.props.userType === "pySpring") {
      localStorage.setItem("pySpringCode", editor.getValue());
    }
  };

  getSelectionRange() {
    return this.aceEditor.selection.getRange();
  }

  // handleMousemove = () => {
  //   console.log("handleMousemove");
  // };

  setAutoCompleters = () => {
    let staticWordCompleter = {
      getCompletions: function (editor, session, pos, prefix, callback) {
        var wordList = ["print()", "len()", "int()"];
        callback(
          null,
          wordList.map(function (word) {
            return {
              caption: word,
              value: word,
              meta: "function",
              completer: {
                insertMatch: (editor) => {
                  clearCompleterTarget(editor);
                  editor.insert(word);
                  if (editor.curOp && !editor.curOp.command.name) {
                    editor.curOp.command.name = "mouse";
                    this.handleOnChange(undefined, editor);
                  }
                  setTimeout(() => {
                    editor.completer.detach();
                  }, 10);

                  const newPos = {
                    row: pos.row,
                    column: session.getLine(pos.row).length - 1,
                  };
                  console.log("setAutoCompleters", newPos);
                  editor.selection.moveCursorToPosition(newPos);
                },
              },
            };
          })
        );
      },
    };

    const clearCompleterTarget = (editor) => {
      const start = editor.selection.getRange().start;
      const end = editor.selection.getRange().end;
      const line = editor.session.getLine(start.row);
      if (line[start.column - 1] && line[start.column - 1] !== `"`) {
        editor.removeWordLeft();
      }
      if (line[end.column] && line[end.column] !== `"`) {
        editor.removeWordRight();
      }
    };
    this.langTools.setCompleters([staticWordCompleter]);
  };

  render() {
    // const {} = this.state;
    // const {} = this;

    return <View />;
  }
}

export default connect((state) => ({ email: state.userinfo.email }))(Container);
