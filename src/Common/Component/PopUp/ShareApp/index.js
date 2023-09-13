import React, { Component } from "react";
import QRCode from "qrcode.react";
import { URL } from "../../../Util/Constant.js";
import * as request from "../../../Util/HTTPRequest.js";
import { showPopUp } from "../";
import OneButton from "../OneButton";
import "./index.scss";

class ShareApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcodeUrl: URL.LIVE_TEST + this.props.pId,
      countryCode: "+82",
      phoneNum: "",
    };
  }

  onClickSend = () => {
    const { qrcodeUrl, countryCode, phoneNum } = this.state;
    const params = {
      countryCode: countryCode,
      localNumber: phoneNum,
      url: qrcodeUrl,
      name: this.props.appName,
    };
    request
      .smsPlayLink(params)
      .then((res) => res.json())
      .then((json) => {
        showPopUp(<OneButton title="링크를 보냈습니다" buttonName="확인" />);
      })
      .catch((e) => console.error(e));
  };

  onClickCopy = () => {
    const copyText = document.querySelector(".input__url");
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/
    document.execCommand("copy");
  };
  onChangeNumber = (e) => {
    const phoneNum = e.target.value;
    this.setState({ phoneNum });
  };
  onChangeCountryCode = (countryCode) => {
    this.setState({ countryCode });
  };

  render() {
    const { qrcodeUrl, phoneNum } = this.state;
    return (
      <div className="popup_shareApp">
        <div className="popup_header">휴대폰으로 공유해보세요</div>
        <h3>링크 복사</h3>

        <div className="qrpopup__row">
          <input className="qrpopup__input input__url" type="text" value={qrcodeUrl} readOnly />

          <button className="qrpopup_button" onClick={() => this.onClickCopy()}>
            복사
          </button>
        </div>
        <h3>휴대폰으로 전송</h3>

        <div className="qrpopup__row">
          <input
            type="number"
            className="qrpopup__input qr"
            value={phoneNum}
            onChange={this.onChangeNumber}
            placeholder="01012345678"
          />
          <button className="qrpopup_button" onClick={this.onClickSend}>
            전송
          </button>
        </div>
        <h3>QR 코드 인식</h3>
        <div className="qrpopup__row qrcode">
          <QRCode className="popup_shareApp_qrcode" value={qrcodeUrl} style={{ width: "100px", height: "100px" }} />
          <span>{`휴대폰의 카메라를 켜서 \nQR 코드를 인식시켜 보세요!`}</span>
        </div>
      </div>
    );
  }
}

export default ShareApp;
