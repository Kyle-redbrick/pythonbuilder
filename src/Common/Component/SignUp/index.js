import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import * as TrackingUtil from "../../Util/TrackingUtil";
import * as request from "../../../Common/Util/HTTPRequest";
import sha256 from "../../../Common/Util/SHA256";
import { showAlert } from "../../../Common/Util/AlertManager";
import { DEFAULT_PROFILE_IMAGES } from "../../../Common/Util/Constant";
import { updateUserInfo } from "../../../Common/Store/Reducer/UserInfo";
import signupImage from "../../../Image/login-img@2x.png";
import { MainPopupType } from "../../Util/Constant";
import * as popupAction from "../../Store/Reducer/Popup";

import "./index.scss";
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warnEmail: false,
      warnPW: false,
      warnPWRe: false,
      warnName: false,
      warnPhoneNum: false,
      warnVerifyNum: false,

      isAccepted: false,
      email: "",
      password: "",
      passwordRe: "",
      username: "",
      countryCode: "+82",
      phoneNum: "",
      verifyNum: "",
      signupSuccess: false,
      needRedirect: false,
      phoneInputReadonly: false,
      isMarketingAgreement: false,
    };
  }
  componentDidMount() {}

  getIsEmailValid = (email) => {
    var re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  getIsPWValid = (password) => {
    // TODO
    return password && password.length >= 6;
  };
  getIsPWReValid = (password) => {
    // TODO
    return password && password.length >= 4 && password === this.state.password;
  };
  getIsNameValid = (username) => {
    // TODO
    return username && username.length >= 2;
  };
  getIsPhoneNumValid = (phoneNum) => {
    // TODO : check whether or not typeof phoneNum is number
    return phoneNum && phoneNum.length >= 11 && true;
  };
  getIsVerifyNumValid = (verifyNum) => {
    // TODO : check whether or not typeof phoneNum is number + validation
    return verifyNum && verifyNum.length >= 5 && true;
  };

  handleInputChange = (e) => {
    const target = e.target;
    switch (target.name) {
      case "email":
        this.setState((state) => ({
          warnEmail: !this.getIsEmailValid(target.value),
          isAccepted: state.isAccepted && this.getIsEmailValid(target.value),
          [target.name]: target.value,
        }));
        break;
      case "password":
        this.setState((state) => ({
          warnPW: !this.getIsPWValid(target.value),
          isAccepted: state.isAccepted && this.getIsPWValid(target.value),
          [target.name]: target.value,
        }));
        break;
      case "passwordRe":
        this.setState((state) => ({
          warnPWRe: !this.getIsPWReValid(target.value),
          isAccepted: state.isAccepted && this.getIsPWReValid(target.value),
          [target.name]: target.value,
        }));
        break;
      case "username":
        this.setState((state) => ({
          warnName: !this.getIsNameValid(target.value),
          isAccepted: state.isAccepted && this.getIsNameValid(target.value),
          [target.name]: target.value,
        }));
        break;
      case "phoneNum":
        this.setState((state) => ({
          warnPhoneNum: !this.getIsPhoneNumValid(target.value),
          isAccepted: state.isAccepted && this.getIsPhoneNumValid(target.value),
          [target.name]: target.value,
        }));
        break;
      case "verifyNum":
        this.setState({
          warnVerifyNum: !this.getIsVerifyNumValid(target.value),
          [target.name]: target.value,
        });
        break;
      case "isMarketingAgreement":
        this.setState((prevState) => ({
          isMarketingAgreement: !prevState.isMarketingAgreement,
        }));
      default:
        break;
    }
  };
  handleCountryChange = (countryCode) => {
    this.setState({
      countryCode,
    });
  };
  checkEmailPwName = () => {
    const { email, password, passwordRe, username } = this.state;
    const { warnEmail, warnPW, warnPWRe, warnName } = {
      warnEmail: !this.getIsEmailValid(email),
      warnPW: !this.getIsPWValid(password),
      warnPWRe: !this.getIsPWReValid(passwordRe),
      warnName: !this.getIsNameValid(username),
    };
    if (warnEmail || warnPW || warnPWRe || warnName) {
      this.setState({
        warnEmail,
        warnPW,
        warnPWRe,
        warnName,
        isAccepted: false,
      });
      return false;
    } else {
      return true;
    }
  };

  handleSendToMobile = (e) => {
    console.log("handleSendToMobile");
    e.preventDefault();
    if (!this.checkEmailPwName()) {
      return;
    } else if (!this.getIsPhoneNumValid(this.state.phoneNum)) {
      this.setState({ warnPhoneNum: "휴대전화번호를 입력해주세요." });
      return;
    }
    const countryCode = this.state.countryCode;
    const localNumber = this.state.phoneNum;
    const params = { countryCode, localNumber };
    request
      .smsIssue(params)
      .then((response) => {
        if (response.status === 409) {
          showAlert("ID_SIGNUP_ALERT_TITLE_WARN", "ID_SIGNUP_ALERT_SMS_RETRY", "ID_SIGNUP_ALERT_CLOSEBTN");
        } else {
          showAlert("ID_SIGNUP_ALERT_TITLE_SUCC", "ID_SIGNUP_ALERT_SMS_SUCC", "ID_SIGNUP_ALERT_CLOSEBTN");
          this.setState({ isVerifyWarningOn: true, isPhoneWarningOn: true });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  handleVerifyToServer = (e) => {
    e.preventDefault();
    if (!this.checkEmailPwName()) {
      return;
    } else if (!this.getIsPhoneNumValid(this.state.phoneNum)) {
      this.setState({ warnVerifyNum: "인증번호를 입력해주세요." });
      return;
    }
    const countryCode = this.state.countryCode;
    const localNumber = this.state.phoneNum;
    const certcode = this.state.verifyNum;
    const params = { countryCode, localNumber, certcode };
    console.log(params, "parms");
    request.smsCheck(params).then((response) => {
      if (response.status === 200) {
        console.log("성공");

        showAlert("ID_SIGNUP_ALERT_TITLE_SUCC", "ID_SIGNUP_ALERT_VERI_SUCC", "ID_SIGNUP_ALERT_CLOSEBTN");
        this.setState({
          isAccepted: true,
          phonephoneInputReadonly: true,
        });
      } else {
        console.log("실패");

        showAlert("ID_SIGNUP_ALERT_TITLE_WARN", "ID_SIGNUP_ALERT_VERI_RETRY", "ID_SIGNUP_ALERT_CLOSEBTN");
      }
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.checkEmailPwName()) return;
    const { email, password, username, phoneNum, isAccepted, countryCode, isMarketingAgreement } = this.state;
    const warnPhoneNum = !this.getIsPhoneNumValid(phoneNum);
    if (warnPhoneNum) {
      this.setState({
        warnPhoneNum,
        isAccepted: false,
      });
      return;
    }
    if (!isAccepted) {
      this.setState({
        warnVerifyNum: true,
        isAccepted: false,
      });
      return;
    }
    const icon = DEFAULT_PROFILE_IMAGES[Math.floor(Math.random() * Math.floor(DEFAULT_PROFILE_IMAGES.length))];
    const params = {
      email,
      password: sha256(password),
      phone: phoneNum,
      name: username,
      countryCode,
      icon,
      isMarketingAgreement,
    };
    request
      .signup(params)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 409) {
          showAlert("ID_SIGNUP_ALERT_TITLE_WARN", "ID_SIGNUP_ALERT_EMAIL", "ID_SIGNUP_ALERT_CLOSEBTN");
        } else if (json.status === 500) {
          showAlert("ID_SIGNUP_ALERT_TITLE_WARN", "ID_SIGNUP_ALERT_RETRY", "ID_SIGNUP_ALERT_CLOSEBTN");
        } else {
          const { email, signedPlatform } = json.user;
          TrackingUtil.sendAPEvent({
            event: "signUp",
            "DLV - email": email,
            "DLV - platform": signedPlatform,
            "DLV - live": true,
          });
          TrackingUtil.sendGAEvent(
            {
              category: "Signup",
              action: "Signup_Success",
            },
            json.user.email,
          );
          TrackingUtil.sendGTMEvent("Signup Success");
          TrackingUtil.sendNaverPremiumLogEvent(2, 1);
          TrackingUtil.sendNsmartEvent(1823);

          // author : john@wizscool.io
          // date : 2020.07.02
          window.setBizSpring("RGR");

          localStorage.setItem("wizToken", json.token);
          this.props.updateUserInfo(json.user);
          this.setState({ signupSuccess: true });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  handleCloseBtn = () => {
    this.props.setMainPopup(null);
  };
  handleTermsBtn = () => {
    window.open("/support/terms");
  };
  handlePrivacyBtn = () => {
    window.open("/support/privacy");
  };
  handleLoginBtn = () => {
    this.props.setMainPopup(MainPopupType.LOGIN);
  };

  render() {
    const {
      warnEmail,
      warnPW,
      warnPWRe,
      warnName,
      warnPhoneNum,
      warnVerifyNum,
      isAccepted,
      signupSuccess,
      email,
      username,
      password,
      passwordRe,
      phoneNum,
      verifyNum,
      phoneInputReadonly,
    } = this.state;

    let handleSendBtn;
    let handleVerifyBtn;
    let sendBtnToggle = "off";
    let verifyBtnToggle = "off";
    if (isAccepted && phoneInputReadonly && this.getIsPWReValid(passwordRe)) {
      verifyBtnToggle = "on";
      sendBtnToggle = "on";
    } else if (this.getIsPhoneNumValid(phoneNum) && this.getIsVerifyNumValid(verifyNum)) {
      handleSendBtn = this.handleSendToMobile;
      handleVerifyBtn = this.handleVerifyToServer;
      sendBtnToggle = "on";
      verifyBtnToggle = "on";
    } else if (this.getIsPhoneNumValid(phoneNum)) {
      handleSendBtn = this.handleSendToMobile;
      sendBtnToggle = "on";
    }
    return (
      <div className={"SignupContainer"}>
        <div className="SignupContainer__overlay" />
        {signupSuccess ? (
          <div className="SignupContainer__welcome">
            <div className="WelcomeModal">
              <div className="WelcomeModal__inner">
                <h1 className="WelcomeModal__title" style={{ whiteSpace: "pre-line" }}>
                  {this.props.intl.formatMessage({
                    id: "ID_WELCOME_TITLE",
                  })}
                </h1>
                <p className="WelcomeModal__desc" style={{ whiteSpace: "pre-line" }}>
                  {this.props.intl.formatMessage({
                    id: "ID_WELCOME_DESC",
                  })}
                </p>
                <input
                  className={`WelcomeModal__enterBtn`}
                  onClick={this.handleCloseBtn}
                  type="button"
                  value={this.props.intl.formatMessage({
                    id: "ID_WELCOME_ENTERBTN",
                  })}
                />
                <p onClick={this.handleCloseBtn} className="WelcomeModal__closeBtn" />
              </div>
            </div>
          </div>
        ) : (
          <div className="SignupContainer__main">
            <div className="SignupModal">
              <div className="SignupModal__row__text">
                <h1 className="SignupModal__title">
                  <FormattedMessage id="ID_SIGNUP_TITLE" />
                </h1>

                <h3 className="SignupModal__sub__title">
                  <FormattedMessage id="ID_LOGIN_SUBTITLE" />
                </h3>
                <form className="SignupForm" autoComplete="off">
                  {/* email */}
                  <div className="SignupForm__row ">
                    <input
                      className={`SignupForm__input ${warnEmail ? "input--warning__on" : "input--warning__off"}`}
                      type="text"
                      name="email"
                      value={email}
                      onChange={this.handleInputChange}
                      placeholder={this.props.intl.formatMessage({
                        id: "ID_SIGNUP_EMAIL_PH",
                      })}
                    />
                  </div>

                  <p className={`SignupFormMsg`}>
                    {warnEmail && (
                      <span className={`SignupFormMsg__text`}>
                        {this.props.intl.formatMessage({
                          id: "ID_SIGNUP_EMAIL_WN",
                        })}
                      </span>
                    )}
                  </p>
                  {/* name */}
                  <div className="SignupForm__row ">
                    <input
                      className={`SignupForm__input ${warnName ? "input--warning__on" : "input--warning__off"}`}
                      type="text"
                      name="username"
                      value={username}
                      onChange={this.handleInputChange}
                      placeholder={this.props.intl.formatMessage({
                        id: "ID_SIGNUP_NAME_WN",
                      })}
                    />
                  </div>

                  <p className={`SignupFormMsg`}>
                    {warnName && (
                      <span className={`SignupFormMsg__text`}>
                        {this.props.intl.formatMessage({
                          id: "ID_SIGNUP_VERIFY_WN",
                        })}
                      </span>
                    )}
                  </p>
                  {/* password */}
                  <div className="SignupForm__row">
                    <input
                      className={`SignupForm__input ${warnPW ? "input--warning__on" : "input--warning__off"}`}
                      type="password"
                      name="password"
                      value={password}
                      onChange={this.handleInputChange}
                      autoComplete="new-password"
                      placeholder={this.props.intl.formatMessage({
                        id: "ID_SIGNUP_PW_PH",
                      })}
                    />
                  </div>
                  <div className="SignupForm__row">
                    <input
                      className={`SignupForm__input ${
                        !warnPW && warnPWRe ? "input--warning__on" : "input--warning__off"
                      }`}
                      type="password"
                      name="passwordRe"
                      value={passwordRe}
                      onChange={this.handleInputChange}
                      autoComplete="new-password"
                      placeholder={this.props.intl.formatMessage({
                        id: "ID_SIGNUP_PWRE_PH",
                      })}
                    />
                  </div>
                  <p className={`SignupFormMsg`}>
                    {warnPW && (
                      <span className={`SignupFormMsg__text`}>
                        {this.props.intl.formatMessage({
                          id: "ID_SIGNUP_PW_WN",
                        })}
                      </span>
                    )}
                    {!warnPW && warnPWRe && (
                      <span className={`SignupFormMsg__text`}>
                        {this.props.intl.formatMessage({
                          id: "ID_SIGNUP_PWRE_WN",
                        })}
                      </span>
                    )}
                  </p>

                  {/* mobile */}
                  <div className="SignupForm__row ">
                    <input
                      className={`SignupForm__input ${warnPhoneNum ? "input--warning__on" : "input--warning__off"}  ${
                        phoneInputReadonly ? "readonly--on" : "readonly--off"
                      }`}
                      readOnly={phoneInputReadonly}
                      type="text"
                      name="phoneNum"
                      value={phoneNum}
                      onChange={this.handleInputChange}
                      placeholder={this.props.intl.formatMessage({
                        id: "ID_SIGNUP_PHONE",
                      })}
                    />
                    <input
                      className={`SignupFormBtn SignupFormBtn--mobile SignupFormBtn--${sendBtnToggle}`}
                      type="button"
                      value={this.props.intl.formatMessage({
                        id: "ID_SIGNUP_PHONE_BTN",
                      })}
                      onClick={handleSendBtn}
                    />
                  </div>
                  <div className="SignupForm__row">
                    <input
                      className={`SignupForm__input ${
                        !warnPhoneNum && warnVerifyNum ? "input--warning__on" : "input--warning__off"
                      } ${phoneInputReadonly ? "readonly--on" : "readonly--off"}`}
                      readOnly={phoneInputReadonly}
                      type="text"
                      name="verifyNum"
                      value={verifyNum}
                      onChange={this.handleInputChange}
                      placeholder={this.props.intl.formatMessage({
                        id: "ID_SIGNUP_VERIFY_PH",
                      })}
                    />
                    <input
                      className={`SignupFormBtn SignupFormBtn--mobile SignupFormBtn--${verifyBtnToggle}`}
                      type="button"
                      value={this.props.intl.formatMessage({
                        id: "ID_SIGNUP_VERIFY_BTN",
                      })}
                      onClick={handleVerifyBtn}
                    />
                  </div>
                  <p className={`SignupFormMsg`}>
                    {warnPhoneNum && (
                      <span className={`SignupFormMsg__text`}>
                        {this.props.intl.formatMessage({
                          id: "ID_SIGNUP_PHONE_WN",
                        })}
                      </span>
                    )}
                    {!warnPhoneNum && warnVerifyNum && (
                      <span className={`SignupFormMsg__text`}>
                        {this.props.intl.formatMessage({
                          id: "ID_SIGNUP_VERIFY_WN",
                        })}
                      </span>
                    )}
                  </p>

                  <div className="SignupModal__bottomline">
                    {this.props.intl.formatMessage({
                      id: "ID_SIGNUP_TERMSPRIVACY",
                    })}
                    &nbsp;
                    <span
                      className="SignupModal__link"
                      onClick={() => {
                        // this.handleSupportBtn("terms");
                        this.handleTermsBtn();
                      }}
                    >
                      {this.props.intl.formatMessage({
                        id: "ID_SIGNUP_TERMS_LINK",
                      })}
                    </span>
                    &nbsp;
                    <span
                      className="SignupModal__link"
                      onClick={() => {
                        // this.handleSupportBtn("privacy");
                        this.handlePrivacyBtn();
                      }}
                    >
                      {this.props.intl.formatMessage({
                        id: "ID_SIGNUP_PRIVACY_LINK",
                      })}
                    </span>
                  </div>
                  {/* marketing agreement */}
                  <label className="SignupModal__input__checkbox" for="marketing-agreement">
                    <input
                      type="checkbox"
                      id="marketing-agreement"
                      name="isMarketingAgreement"
                      value={this.state.isMarketingAgreement}
                      onClick={this.handleInputChange}
                    />
                    <FormattedMessage id="ID_SIGNUP_MARKETING_AGREEMENT" />
                  </label>
                  {/* submit */}
                  <input
                    className={`SignupFormBtn SignupFormBtn--submit `}
                    onClick={this.handleSubmit}
                    type="submit"
                    value={this.props.intl.formatMessage({
                      id: "ID_SIGNUP_SUBMITBTN",
                    })}
                  />
                </form>

                <div className="SignupModal__bottomline">
                  <div onClick={this.handleLoginBtn} className="SignupModal__link SignupModal__link__login">
                    {this.props.intl.formatMessage({
                      id: "ID_SIGNUP_LOGIN",
                    })}
                  </div>
                </div>
              </div>
              <div className="SignupModal__row__img">
                <img className="SignupModal__img" src={signupImage} alt="logoImage" />
              </div>
              <p onClick={this.handleCloseBtn} className="SignupModal__closeBtn" />
            </div>
          </div>
        )}
        {/* <div className="SignupContainer__welcome">
          <div className="WelcomeModal">
            <div className="WelcomeModal__inner">
              <h1
                className="WelcomeModal__title"
                style={{ whiteSpace: "pre-line" }}
              >
                {this.props.intl.formatMessage({
                  id: "ID_WELCOME_TITLE"
                })}
              </h1>
              <p
                className="WelcomeModal__desc"
                style={{ whiteSpace: "pre-line" }}
              >
                {this.props.intl.formatMessage({
                  id: "ID_WELCOME_DESC"
                })}
              </p>
              <input
                className={`WelcomeModal__enterBtn`}
                onClick={this.handleCloseBtn}
                type="button"
                value={this.props.intl.formatMessage({
                  id: "ID_WELCOME_ENTERBTN"
                })}
              />
              <p
                onClick={this.handleCloseBtn}
                className="WelcomeModal__closeBtn"
              />
            </div>
          </div>
        </div> */}
      </div>
    );
  }
}

export default connect((state) => ({ mainPopup: state.popup.mainPopup }), {
  updateUserInfo: updateUserInfo,
  setMainPopup: popupAction.setMainPopup,
})(withRouter(injectIntl(SignUp)));
