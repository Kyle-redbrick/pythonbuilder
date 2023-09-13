import React, { Component } from "react";
import "./index.scss";

const defaultErrorMessage = <p>현재 Daum 우편번호 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.</p>;

class PostcodePopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "block",
      width: this.props.width,
      height: this.props.height,
      error: false,
    };
  }
  componentDidMount() {
    const scriptId = "daum_postcode_script";
    const script = document.getElementById(scriptId);
    if (!script) {
      const script = document.createElement("script");
      script.src = this.props.scriptUrl;
      script.onload = () => this.initiate(this);
      script.onerror = (error) => this.handleError(error);
      script.id = scriptId;
      document.body.appendChild(script);
    } else this.initiate(this);
  }

  initiate = (comp) => {
    window.daum.postcode.load(() => {
      const Postcode = new window.daum.Postcode({
        oncomplete: function oncomplete(data) {
          comp.props.onComplete(data);
          if (comp.props.autoClose) comp.setState({ display: "none" });
        },
        onresize: function onresize(size) {
          if (comp.props.autoResize) comp.setState({ height: size.height });
        },
        alwaysShowEngAddr: comp.props.alwaysShowEngAddr,
        animation: comp.props.animation,
        autoMapping: comp.props.autoMapping,
        autoResize: comp.props.autoResize,
        height: comp.props.height,
        hideEngBtn: comp.props.hideEngBtn,
        hideMapBtn: comp.props.hideMapBtn,
        maxSuggestItems: comp.props.maxSuggestItems,
        pleaseReadGuide: comp.props.pleaseReadGuide,
        pleaseReadGuideTimer: comp.props.pleaseReadGuideTimer,
        shorthand: comp.props.shorthand,
        showMoreHName: comp.props.showMoreHName,
        submitMode: comp.props.submitMode,
        theme: comp.props.theme,
        useSuggest: comp.props.useSuggest,
        width: comp.props.width,
        zonecodeOnly: comp.props.zonecodeOnly,
        focusInput: comp.props.focusInput,
        focusContent: comp.props.focusContent,
      });

      Postcode.embed(this.wrap, {
        q: this.props.defaultQuery,
        autoClose: this.props.autoClose,
      });
    });
  };

  handleError = (error) => {
    error.target.remove();
    this.setState({ error: true });
  };

  render() {
    const { title, subtitle } = this.props;
    return (
      <div className="popup_postcode">
        <div className="popup_title">{title || "우편번호 찾기"}</div>
        {subtitle && <div className="popup_subtitle">{subtitle}</div>}
        <div
          ref={(div) => {
            this.wrap = div;
          }}
          style={{
            width: this.state.width,
            height: this.state.height,
            display: this.state.display,
          }}
        >
          {this.state.error && this.props.errorMessage}
        </div>
      </div>
    );
  }
}

PostcodePopUp.defaultProps = {
  alwaysShowEngAddr: false,
  animation: false,
  autoClose: false,
  autoMapping: true,
  autoResize: false,
  defaultQuery: null,
  errorMessage: defaultErrorMessage,
  height: 400,
  hideEngBtn: false,
  hideMapBtn: false,
  maxSuggestItems: 10,
  pleaseReadGuide: 0,
  pleaseReadGuideTimer: 1.5,
  scriptUrl: "https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js?autoload=false",
  shorthand: true,
  showMoreHName: false,
  style: null,
  submitMode: true,
  theme: null,
  useSuggest: true,
  width: "100%",
  zonecodeOnly: false,
  focusInput: true,
  focusContent: true,
};

export default PostcodePopUp;
