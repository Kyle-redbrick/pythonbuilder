import React from "react";
import ReactDOM from "react-dom";
import { FormattedMessage } from "react-intl";
// import * as request from "./HTTPRequest";

import en from "react-intl/locale-data/en";
import ko from "react-intl/locale-data/ko";
import zh from "react-intl/locale-data/zh";
import locale from "../../locale";

import { IntlProvider, addLocaleData } from "react-intl";

addLocaleData([...en, ...ko, ...zh]);

const getNavigatorLanguage = () => {
  // let lang;
  // lang = localStorage.getItem("wizLang");
  // if (lang && ["ko", "en", "zh"].includes(lang)) return lang;
  // var str;
  // if (navigator.languages && navigator.languages.length) {
  //   str = navigator.languages[0];
  // } else {
  //   str =
  //     navigator.userLanguage ||
  //     navigator.language ||
  //     navigator.browserLanguage ||
  //     "en";
  // }
  // lang = str.replace(/-[A-Z]*/, "");
  // localStorage.setItem("wizLang", lang);
  // return lang;
  return "ko";
};

const defaultLang = getNavigatorLanguage();

export const showVideo = (url) => {
  const handleClose = (e) => {
    const empty = React.createElement("div");
    ReactDOM.render(empty, document.getElementById("alert"));
  };

  const element = React.createElement(
    "div",
    {
      id: "wizAlert",
    },
    <React.Fragment>
      <div className="overlay" onClick={handleClose} />
      <div className="video_wrapper">
        <div className="video_button" onClick={handleClose}>
          <p className="video_button_image" />
          닫기
        </div>
        <video width="1280" height="720" playsInline controls autoPlay={true}>
          <source src={url} />
        </video>
      </div>
    </React.Fragment>,
  );

  ReactDOM.render(
    <IntlProvider locale={defaultLang} messages={locale[defaultLang]}>
      {element}
    </IntlProvider>,
    document.getElementById("alert"),
  );
};

export const showAlert = (titleId, msgId, btnTextId, callback) => {
  btnTextId = !btnTextId ? "OK" : btnTextId;

  const handleClose = (e) => {
    const empty = React.createElement("div");
    ReactDOM.render(empty, document.getElementById("alert"));
  };

  let handleOK = handleClose;
  if (callback) {
    handleOK = (e) => {
      callback();
      handleClose();
    };
  }

  const element = React.createElement(
    "div",
    {
      id: "wizAlert",
    },
    <React.Fragment>
      <div className="overlay" onClick={handleClose} />
      <div className="onebtn_wrapper">
        <p className="closeBtn" onClick={handleClose} />
        <div className="title">
          <FormattedMessage id={titleId} />
        </div>
        {msgId && (
          <div className="message">
            <FormattedMessage id={msgId} />
          </div>
        )}
        <button className="okBtn" type="button" onClick={handleOK}>
          <FormattedMessage id={btnTextId} />
        </button>
      </div>
    </React.Fragment>,
  );

  ReactDOM.render(
    <IntlProvider locale={defaultLang} messages={locale[defaultLang]}>
      {element}
    </IntlProvider>,
    document.getElementById("alert"),
  );
};

export const showTwoBtnAlert = (msgId, okBtnTextId, cancelBtnTextId, callback, mainColorOkBtn) => {
  okBtnTextId = !okBtnTextId ? "OK" : okBtnTextId;

  const handleClose = (e) => {
    const empty = React.createElement("div");
    ReactDOM.render(empty, document.getElementById("alert"));
  };
  const handleOK = (e) => {
    callback();
    handleClose();
  };

  const element = React.createElement(
    "div",
    {
      id: "wizAlert",
    },
    <React.Fragment>
      <div className="overlay" onClick={handleClose} />
      <div className="twobtn_wrapper">
        <div className="two_btn_message">
          <FormattedMessage id={msgId} />
        </div>
        <div className="two_btns">
          <button type="button" className="two_btn" id="two_btn_cancel" onClick={handleClose}>
            <FormattedMessage id={cancelBtnTextId} />
          </button>
          <button
            type="button"
            className="two_btn"
            id={mainColorOkBtn ? "two_btn_main_color" : "two_btn_ok"}
            onClick={handleOK}
          >
            <FormattedMessage id={okBtnTextId} />
          </button>
        </div>
      </div>
    </React.Fragment>,
  );

  ReactDOM.render(
    <IntlProvider locale={defaultLang} messages={locale[defaultLang]}>
      {element}
    </IntlProvider>,
    document.getElementById("alert"),
  );
};

export const showTwoBtnAlertWithValues = (
  titleId,
  titleValues,
  msgId,
  okBtnTextId,
  cancelBtnTextId,
  callback,
  mainColorOkBtn,
) => {
  okBtnTextId = !okBtnTextId ? "OK" : okBtnTextId;

  const handleClose = (e) => {
    const empty = React.createElement("div");
    ReactDOM.render(empty, document.getElementById("alert"));
  };
  const handleOK = (e) => {
    callback();
    handleClose();
  };

  const element = React.createElement(
    "div",
    {
      id: "wizAlert",
    },
    <React.Fragment>
      <div className="overlay" onClick={handleClose} />
      <div className="twobtn_wrapper">
        <div className="title__two_msg">
          <FormattedMessage id={titleId} values={titleValues} />
        </div>
        <div className="two_btn_message">
          <FormattedMessage id={msgId} />
        </div>
        <div className="two_btns">
          <button type="button" className="two_btn" id="two_btn_cancel" onClick={handleClose}>
            <FormattedMessage id={cancelBtnTextId} />
          </button>
          <button
            type="button"
            className="two_btn"
            id={mainColorOkBtn ? "two_btn_main_color" : "two_btn_ok"}
            onClick={handleOK}
          >
            <FormattedMessage id={okBtnTextId} />
          </button>
        </div>
      </div>
    </React.Fragment>,
  );

  ReactDOM.render(
    <IntlProvider locale={defaultLang} messages={locale[defaultLang]}>
      {element}
    </IntlProvider>,
    document.getElementById("alert"),
  );
};

export const showTwoBtnAlertWithTextarea = (
  titleId,
  titleValues,
  placeholderId,
  placeholderValues,
  okBtnTextId,
  cancelBtnTextId,
  callback,
) => {
  var message = "";
  const onChangeMessage = (e) => {
    message = e.target.value;
  };
  const handleClose = (e) => {
    const empty = React.createElement("div");
    ReactDOM.render(empty, document.getElementById("alert"));
  };
  const handleOK = (e) => {
    handleClose();
    callback(message);
  };

  const element = React.createElement(
    "div",
    {
      id: "wizAlert",
    },
    <React.Fragment>
      <div className="overlay" onClick={handleClose} />
      <div className="twobtn_wrapper">
        <div className="title__two_msg">
          <FormattedMessage id={titleId} values={titleValues} />
        </div>
        <div className="textarea">
          <FormattedMessage id={placeholderId} values={placeholderValues}>
            {(placeholder) => <textarea placeholder={placeholder} onChange={onChangeMessage} />}
          </FormattedMessage>
        </div>
        <div className="two_btns">
          <button type="button" className="two_btn" id="two_btn_cancel" onClick={handleClose}>
            <FormattedMessage id={cancelBtnTextId} />
          </button>
          <button type="button" className="two_btn" id="two_btn_main_color" onClick={handleOK}>
            <FormattedMessage id={okBtnTextId} />
          </button>
        </div>
      </div>
    </React.Fragment>,
  );

  ReactDOM.render(
    <IntlProvider locale={defaultLang} messages={locale[defaultLang]}>
      {element}
    </IntlProvider>,
    document.getElementById("alert"),
  );
};

export const showTwoBtnAlertWithKeyValueMsg = (msgId, okBtnTextId, cancelBtnTextId, msg, callback, mainColorOkBtn) => {
  okBtnTextId = !okBtnTextId ? "OK" : okBtnTextId;

  const handleClose = (e) => {
    const empty = React.createElement("div");
    ReactDOM.render(empty, document.getElementById("alert"));
  };
  const handleOK = (e) => {
    callback();
    handleClose();
  };

  const element = React.createElement(
    "div",
    {
      id: "wizAlert",
    },
    <React.Fragment>
      <div className="overlay" onClick={handleClose} />
      <div className="twobtn_wrapper">
        <div className="message_kv">
          <FormattedMessage id={msgId} />
          <div className="message__holder">
            {Object.keys(msg).map((key, index) => {
              return (
                <div key={index} className="message__holder__kv__row">
                  <div className="message__holder__key">{key}</div>
                  <div className="message__holder__value">{msg[key]}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="two_btns">
          <button type="button" className="two_btn" id="two_btn_cancel" onClick={handleClose}>
            <FormattedMessage id={cancelBtnTextId} />
          </button>
          <button
            type="button"
            className="two_btn"
            id={mainColorOkBtn ? "two_btn_main_color" : "two_btn_ok"}
            onClick={handleOK}
          >
            <FormattedMessage id={okBtnTextId} />
          </button>
        </div>
      </div>
    </React.Fragment>,
  );

  ReactDOM.render(
    <IntlProvider locale={defaultLang} messages={locale[defaultLang]}>
      {element}
    </IntlProvider>,
    document.getElementById("alert"),
  );
};

export const showFreeTrialSubmitPopup = (callback) => {
  const handleClose = (e) => {
    const empty = React.createElement("div");
    ReactDOM.render(empty, document.getElementById("alert"));
  };

  let handleOK = handleClose;
  if (callback) {
    handleOK = (e) => {
      callback();
      handleClose();
    };
  }

  const element = React.createElement(
    "div",
    {
      id: "wizAlert",
    },
    <React.Fragment>
      <div className="overlay" onClick={handleClose} />
      <div className="onebtn_wrapper">
        <p className="closeBtn" onClick={handleClose} />
        <div className="title">
          <FormattedMessage id={"ID_FREE_TRIAL_SURVEY_SUBMIT_TITLE"} />
        </div>
        <div className="freeTiralMessage">
          <FormattedMessage id={"ID_FREE_TRIAL_SURVEY_SUBMIT_DESCRIPTION"} />
        </div>
        <div className="contact">
          <p className="callImage" />
          <FormattedMessage id={"ID_FREE_TRIAL_SURVEY_SUBMIT_CONTANT"} />
        </div>
        <button className="okBtn" type="button" onClick={handleOK}>
          <FormattedMessage id={"ID_FREE_TRIAL_SURVEY_SUBMIT_OK"} />
        </button>
      </div>
    </React.Fragment>,
  );

  ReactDOM.render(
    <IntlProvider locale={defaultLang} messages={locale[defaultLang]}>
      {element}
    </IntlProvider>,
    document.getElementById("alert"),
  );
};
