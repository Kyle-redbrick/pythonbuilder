import React, { Component } from "react";
import * as request from "../../../Util/HTTPRequest.js";
import { showPopUp } from "../";
import OneButton from "../OneButton";
import DropDown from "../../DropDown";
import "./index.scss";

const categories = {
  Game: { title: "게임" },
  Util: { title: "유틸" },
};

class ProjectInfoPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "이름",
      description: "요약",
      category: "Game",
      imgUrl: "",
    };
  }
  componentDidMount() {
    this.getProjectInfo(this.props.pId);
  }

  getProjectInfo = (pId) => {
    request
      .getPublishedProject({ pId: this.props.pId })
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          name: json.name,
          description: json.description,
          category: json.category,
          imgUrl: json.icon,
        });
      })
      .catch((e) => console.error(e));
  };
  postProjectInfo = (pId) => {
    const params = {
      name: this.state.name,
      description: this.state.description,
      category: this.state.category,
      icon: this.state.icon,
    };
    request
      .postPublishedProject({ ...params, pId: this.props.pId })
      .then((res) => res.json())
      .then((json) => {
        showPopUp(<OneButton title="수정되었습니다" buttonName="확인" buttonAction={this.props.completion} />);
      })
      .catch((e) => console.error(e));
  };

  onClickCancel = () => {
    this.props.dismiss();
  };
  onClickUpdate = () => {
    this.postProjectInfo(this.props.pId);
  };

  onChangeName = (e) => {
    const name = e.target.value;
    this.setState({ name: name });
  };
  onChangeDescription = (e) => {
    const description = e.target.value;
    this.setState({ description: description });
  };
  onChangeCategory = (item) => {
    const title = item;
    let category = "Game";
    Object.keys(categories).forEach((key) => {
      if (categories[key].title === title) {
        category = key;
      }
    });
    this.setState({ category: category });
  };

  render() {
    const { name, description, category, imgUrl } = this.state;
    return (
      <div className="popup_projectinfo">
        <div className="popup_header">퍼블리싱</div>
        <div className="popup_projectinfo_input">
          <div className="popup_projectinfo_input_title">앱 이름</div>
          <input value={name} placeholder="앱 이름" onChange={this.onChangeName} />
        </div>
        <div className="popup_projectinfo_input">
          <div className="popup_projectinfo_input_title">앱 설명</div>
          <div style={{ marginLeft: "auto" }}>
            <textarea value={description} placeholder="앱 설명" onChange={this.onChangeDescription} />
            <DropDown
              defaultValue={categories[category].title}
              list={["게임", "유틸"]}
              handleSelectItem={(item) => {
                this.onChangeCategory(item);
              }}
            />
          </div>
        </div>
        <div className="popup_projectinfo_input">
          <div className="popup_projectinfo_input_title">아이콘 이미지</div>
          <img src={imgUrl} alt={name} />
        </div>
        <div className="popup_buttons">
          <button className="popup_button popup_button-cancel" onClick={this.onClickCancel}>
            취소
          </button>
          <button className="popup_button" onClick={this.onClickUpdate}>
            업데이트
          </button>
        </div>
      </div>
    );
  }
}

export default ProjectInfoPopUp;
