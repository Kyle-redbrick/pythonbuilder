import React, { Component, Fragment } from "react";
import * as request from "../../../Util/HTTPRequest";
import { oxQuizTemplate } from "./OxQuizTemplate";
import icon_number_step_1 from "../../../../Image/icon-number-step-1@2x.png";
import icon_number_step_2 from "../../../../Image/icon-number-step-2@2x.png";
import icon_number_step_3 from "../../../../Image/icon-number-step-3@2x.png";
import icon_number_step_4 from "../../../../Image/icon-number-step-4@2x.png";
import discount_10 from "../../../../Image/image-10-discount-m@3x.png";
import icon_kakaotalk from "../../../../Image/free-icon-kakao-talk.svg";
import celebration from "../../../../Image/image-celebration@2x.png";
import caret_right from "../../../../Image/icon-caret-right.svg";
import "./index.scss";

export default class OxQuizPopup extends Component {
  state = {
    order: 1,
    score: 0,
    isAnswer: false,
    stage: "quiz",
    // name: "",
    phone: "",
    isValid: false,
    isEmpty: true,
    hasAlready: false,
  };

  steps = [icon_number_step_1, icon_number_step_2, icon_number_step_3, icon_number_step_4];

  handleOnClick = (choice, answer) => {
    this.setState(
      {
        stage: this.state.stage === "quiz" ? "result" : "quiz",
      },
      () => {
        if (choice === answer) {
          this.setState({ score: this.state.score + 1, isAnswer: true });
        } else {
          this.setState({ isAnswer: false });
        }
      },
    );
  };

  handleProgress = (value) => {
    const { order, stage } = this.state;
    if (order === 4 && stage === "result") {
      this.setState({ stage: "final" });
    } else if (value === "coupon") {
      this.setState({ stage: "coupon" });
    } else if (value === "retry") {
      this.setState({ order: 1, stage: "quiz", score: 0 });
    } else {
      this.setState({
        order: this.state.order + 1,
        stage: this.state.stage === "quiz" ? "result" : "quiz",
      });
    }
  };

  handleOnChange = ({ name, value }) => {
    if (name === "phone") {
      const isValid = /^\d{3}-?\d{4}-?\d{4}$/.test(value);
      this.setState({ isValid, isEmpty: !value ? true : false });
    }
    this.setState({ [name]: value });
  };

  handleOnSubmit = async (e) => {
    e.preventDefault();
    const { phone, score } = this.state;
    const params = {
      phone: phone.replaceAll("-", ""),
      answerCount: score,
    };
    try {
      const json = await request.createOxQuizCoupon(params).then((res) => res.json());
      if (json.success) {
        this.setState({ stage: "complete" });
      } else {
        this.setState({ hasAlready: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const { quiz } = oxQuizTemplate;
    const {
      order,
      score,
      isAnswer,
      stage,
      // name,
      phone,
      isValid,
      isEmpty,
      // hasAlready
    } = this.state;
    const { handleOnClick, handleProgress, handleOnChange, handleOnSubmit, steps } = this;
    if (stage === "quiz") {
      return (
        <div className="oxQuiz">
          {quiz.map(({ id, title, answer }, index) => {
            if (id === order) {
              return (
                <Fragment key={id}>
                  <h1>Q{id}.</h1>
                  <h3>{title}?</h3>
                  <img src={steps[index]} alt="step" />
                  <hr />
                  {/* <p>{description}</p> */}
                  <div className="btn__group">
                    <div
                      data-value={"o"}
                      onClick={(e) => handleOnClick(e.target.dataset.value, answer)}
                      className="btn__o"
                    >
                      O
                    </div>
                    <div
                      data-value={"x"}
                      onClick={(e) => handleOnClick(e.target.dataset.value, answer)}
                      className="btn__x"
                    >
                      X
                    </div>
                  </div>
                </Fragment>
              );
            }
            return null;
          })}
        </div>
      );
    } else if (stage === "result") {
      if (isAnswer) {
        return (
          <div className="oxQuiz__success">
            <h1 style={{ color: "#63baf5" }}>O</h1>
            <h2>정답입니다!</h2>
            <img src={discount_10} alt="discount" />
            <p className="discount--acc">{`누적 할인율 ${score * 10}%`}</p>
            <p className="discount--default">(1년 패키지 기준)</p>
            <hr />
            <p>{order < 5 && quiz[order - 1].description}</p>
            <button onClick={handleProgress}>계속 진행</button>
          </div>
        );
      } else {
        return (
          <div className="oxQuiz__fail">
            <h1 style={{ color: "#ff8122" }}>X</h1>
            <h2>아쉽습니다!</h2>
            <p className="discount--acc">{`누적 할인율 ${score * 10}%`}</p>
            <p className="discount--default">(1년 패키지 기준)</p>
            <hr />
            <p>{order < 5 && quiz[order - 1].description}</p>
            <button onClick={handleProgress}>계속 진행</button>
          </div>
        );
      }
    } else if (stage === "final") {
      return (
        <div className="oxQuiz__final">
          <img src={celebration} alt="celebration" />
          <h1>축하합니다!</h1>
          <div>
            <p>
              총 <strong>{`${score * 10}% 할인`}</strong>에 성공하셨습니다!
            </p>
            <p style={{ color: "#525252" }}>(1년 패키지 기준)</p>
            <p>
              할인 쿠폰은 카카오톡
              <br />
              알림톡으로 발급됩니다.
            </p>
            <p style={{ color: "#ff5353" }}>
              <strong>* 단기 수강권 구매 시 20% 할인 가능</strong>
            </p>
          </div>
          <div className="btn__group">
            <button onClick={() => handleProgress("coupon")} className="btn--kakao">
              <img src={icon_kakaotalk} alt="kakotalk" />
              쿠폰 받기
            </button>
            <button onClick={() => handleProgress("retry")} className="btn--retry">
              다시 재도전
            </button>
          </div>
        </div>
      );
    } else if (stage === "coupon") {
      return (
        <div className="oxQuiz__coupon">
          <h1>
            쿠폰을 발급받을
            <br />
            정보를 입력해 주세요!
          </h1>
          <form onSubmit={handleOnSubmit}>
            {/* <div className="input__item">
              <label>
                <img src={caret_right} alt="caret right" />
                &nbsp;이름
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={e => handleOnChange(e.currentTarget)}
                placeholder="이름을 작성해주세요."
              />
            </div> */}
            <div className="input__item">
              <label>
                <img src={caret_right} alt="caret right" />
                &nbsp;연락처
              </label>
              <input
                type="text"
                name="phone"
                value={phone}
                onChange={(e) => handleOnChange(e.currentTarget)}
                placeholder="휴대폰 번호을 작성해주세요."
              />
            </div>
            {!isEmpty && !isValid && <p className="input--warning">휴대폰 번호 형식이 잘못됐습니다!</p>}
            <input
              type="submit"
              value="확인"
              disabled={isEmpty || (!isEmpty && !isValid)}
              style={{
                backgroundColor: isEmpty || (!isEmpty && !isValid) ? "rgba(99, 186, 245, 0.7)" : "#63baf5",
              }}
            />
          </form>
        </div>
      );
    } else if (stage === "complete") {
      return (
        <div className="oxQuiz__complete">
          <h1>
            할인코드 쿠폰
            <br />
            발급 완료
          </h1>
          <p>
            입력하신 번호로 <br />
            카카오톡 쿠폰이 발송되었습니다. <br />
            참여해주셔서 감사합니다.
          </p>
          <div>
            <a href="http://pf.kakao.com/_xaxoSWxb/chat">쿠폰 확인하기</a>
          </div>
        </div>
      );
    }
  }
}
