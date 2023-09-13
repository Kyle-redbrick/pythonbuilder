import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import * as TrackingUtil from "../../Util/TrackingUtil";

import * as request from "../../../Common/Util/HTTPRequest";
import sha256 from "../../../Common/Util/SHA256";
import { updateUserInfo } from "../../Store/Reducer/UserInfo";
import * as popupAction from "../../Store/Reducer/Popup";

import { MainPopupType } from "../../Util/Constant";
import loginImage from "../../../Image/login-img@2x.png";

import "./index.scss";

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isWarningOn: false,
      isEmailValid: false,
      isPasswordValid: false,
      email: "",
      password: "",
      keepMeSign: false,
    };
  }

  handleCloseBtn = () => {
    this.props.setMainPopup(null);
  };
  handleSignupBtn = () => {
    this.props.setMainPopup(MainPopupType.SIGNUP);
  };
  handleForget = () => {
    this.props.setMainPopup(null);
    this.props.history.push({
      pathname: "/find_account",
    });
  };

  getIsEmailValid = (email) => {
    var re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  getIsPasswordValid = (password) => {
    // TODO
    return password.length >= 6;
  };

  handleInputChange = (e) => {
    const target = e.target;
    switch (target.name) {
      case "email":
        const isEmailValid = this.getIsEmailValid(target.value);
        this.setState((state) => ({
          isWarningOn: state.isWarningOn && !(isEmailValid && state.isPasswordValid),
          isEmailValid,
          [target.name]: target.value,
        }));
        break;
      case "password":
        const isPasswordValid = this.getIsPasswordValid(target.value);
        this.setState((state) => ({
          isWarningOn: state.isWarningOn && !(state.isEmailValid && isPasswordValid),
          isPasswordValid,
          [target.name]: target.value,
        }));
        break;
      default:
        break;
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { isEmailValid, isPasswordValid } = this.state;
    if (!(isEmailValid && isPasswordValid)) {
      this.setState({
        isWarningOn: true,
      });
      return;
    }

    // TODO
    // const { keepMeSign } = this.state;
    const { email, password } = this.state;
    const params = { email, password: sha256(password) };
    request
      .login(params)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 403) {
          this.setState({
            isWarningOn: true,
          });
        } else {
          TrackingUtil.sendGAEvent(
            {
              category: "Login",
              action: "Login_Success",
            },
            this.props.email,
          );
          TrackingUtil.sendGTMEvent("Login Success");
          TrackingUtil.sendActiveCampaignEvent(email, "site_visited", { createdAt: new Date().toLocaleString() });

          json.user.payment = json.payment;
          localStorage.setItem("wizToken", json.token);
          this.props.updateUserInfo(json.user);
          if (this.props.redirectURL) {
            this.props.history.push({
              pathname: this.props.redirectURL,
            });
          }
          this.props.setMainPopup(null);
        }
      })
      .catch((error) => console.error(error));
  };

  render() {
    const { isWarningOn, isEmailValid, isPasswordValid } = this.state;
    const { email, password } = this.state;

    const warningToggle = isWarningOn ? "on" : "off";
    const emailWarning = isWarningOn && !isEmailValid ? "on" : "off";
    const passwordWarning = isWarningOn && !isPasswordValid ? "on" : "off";

    console.log(this.props.eventMessage);
    return (
      <div className={`LoginContainer`}>
        <div
          className="LoginContainer__overlay"
          onClick={() => {
            this.props.setMainPopup(null);
          }}
        />
        <div className="LoginContainer__main">
          <div className="LoginModal">
            <div className="LoginModal__row__text">
              <h1 className="LoginModal__title" style={{ whiteSpace: "pre-line" }}>
                {this.props.intl.formatMessage({
                  id: "ID_LOGIN_TITLE",
                })}
              </h1>
              {this.props.eventMessage && (
                <p className="LoginModal__event-subtitle">이벤트 참여를 위해서는 회원가입이 필요합니다</p>
              )}
              <form className="LoginForm">
                <div className="LoginForm__row1">
                  {/* phone */}
                  <div className="LoginForm__row">
                    <input
                      className={`LoginForm__input LoginForm__input--${emailWarning}`}
                      type="text"
                      name="email"
                      value={email}
                      onChange={this.handleInputChange}
                      autoComplete="email"
                      placeholder={this.props.intl.formatMessage({
                        id: "ID_LOGIN_EMAIL",
                      })}
                    />
                  </div>
                  {/* password */}
                  <div className="LoginForm__row">
                    <input
                      name="password"
                      className={`LoginForm__input LoginForm__input--${passwordWarning}`}
                      type="password"
                      value={password}
                      onChange={this.handleInputChange}
                      autoComplete="current-password"
                      placeholder={this.props.intl.formatMessage({
                        id: "ID_LOGIN_PW_PH",
                      })}
                    />
                  </div>
                </div>
                {/* forgot pw */}
                <p className="LoginForm__forgetPassword" onClick={this.handleForget}>
                  {this.props.intl.formatMessage({
                    id: "ID_LOGIN_FORGET",
                  })}
                </p>

                <div className="LoginForm__row__warning">
                  {/* warnning */}
                  <p className={`LoginForm__warningMsg LoginForm__warningMsg--${warningToggle}`}>
                    {this.props.intl.formatMessage({
                      id: "ID_LOGIN_WN",
                    })}
                  </p>
                </div>
                <div className="LoginForm--submit">
                  {/* submit */}
                  <input
                    onClick={this.handleSubmit}
                    className="LoginFormBtn LoginFormBtn--login"
                    type="submit"
                    value={this.props.intl.formatMessage({
                      id: "ID_LOGIN_LOGINBTN",
                    })}
                  />
                  {/* go to sign up */}
                  <input
                    onClick={this.handleSignupBtn}
                    className="LoginFormBtn LoginFormBtn--signin"
                    type="button"
                    value={this.props.intl.formatMessage({
                      id: "ID_LOGIN_SIGNUPBTN",
                    })}
                  />
                </div>
              </form>
            </div>

            <div className="LoginModal__row__img">
              <img className="LoginModal__img" src={loginImage} alt="logoImage" />
            </div>

            <p onClick={this.handleCloseBtn} className="LoginModal__closeBtn" />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    email: state.userinfo.email,
    mainPopup: state.popup.mainPopup,
    eventMessage: state.popup.eventMessage,
  }),
  {
    updateUserInfo: updateUserInfo,
    setMainPopup: popupAction.setMainPopup,
  },
)(withRouter(injectIntl(LogIn)));
