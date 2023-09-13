import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.scss";

// ** should update intlprovider defaultlang computation **
import locale from "../../../locale";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router } from "react-router-dom";
const defaultLang = "ko";

class PopUp extends Component {
  dismiss = () => {
    if (this.props.dismiss) this.props.dismiss();
  };
  render() {
    return (
      <div className={`popup_container ${this.props.popupClassName ? this.props.popupClassName : ""}`}>
        <div className="popup_overlay" onClick={this.dismiss} />
        <div className="popup_scrollable">
          <div
            className={`popup_contents${this.props.scrollable ? " popup_contents-scrollable" : ""}${
              this.props.mobileFullscreen ? " popup_contents-mobileFullscreen" : ""
            }${this.props.defaultPadding ? " popup_contents-defaultPadding" : ""}`}
          >
            {this.props.dismiss && <p className="popup_close" onClick={this.dismiss} />}
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

/**
 * @param content - React component to show in popup container
 * @param onDismiss - Callback function before dismissed
 * @param scrollable - Enable scrolling popup container when overflowed
 * @param requireDismiss - If true, dismiss by overlay click and show popup close button
 */
export const showPopUp = (
  content,
  onDismiss,
  scrollable = false,
  requireDismiss = true,
  mobileFullscreen = false,
  defaultPadding = true,
  popupClassName = null,
) => {
  const dismiss = () => {
    if (onDismiss) onDismiss();
    ReactDOM.render(null, document.getElementById("popup"));
  };
  if (!content) {
    dismiss();
    return;
  }
  let _content = React.cloneElement(content, {
    dismiss,
  });
  ReactDOM.render(
    <IntlProvider locale={defaultLang} messages={locale[defaultLang]}>
      <Router>
        <PopUp
          dismiss={requireDismiss ? dismiss : null}
          scrollable={scrollable}
          mobileFullscreen={mobileFullscreen}
          defaultPadding={defaultPadding}
          popupClassName={popupClassName}
        >
          {_content}
        </PopUp>
      </Router>
    </IntlProvider>,
    document.getElementById("popup"),
  );
};

export { default as OneButtonPopUp } from "./OneButton";
export { default as OneInputPopUp } from "./OneInput";
export { default as ProjectInfoPopUp } from "./ProjectInfo";
export { default as ShareAppPopUp } from "./ShareApp";
export { default as TwoButtonPopUp } from "./TwoButton";
export { default as VideoPopUp } from "./Video";
export { default as EnvTestPopUp } from "./EnvTest";
export { default as TutorProfilePopUp } from "./TutorProfile";
export { default as WizliveQuizPopUp } from "./WizliveQuiz";
export { default as TutorFeedbackPopup } from "./TutorFeedback";
export { default as RadioButtonPopUp } from "./RadioButton";
export { default as PostcodePopUp } from "./Postcode";
export { default as CopyLinkPopup } from "./CopyLink";
export { default as PythonHIntPopup } from "./PythonHint";
export { default as TutorFixedSchedule } from "./TutorFixedSchedule";
