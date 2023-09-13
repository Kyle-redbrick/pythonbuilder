import React, { Component } from "react";
import onClickOutside from "react-onclickoutside";
import "./index.scss";

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.selectedRef = null;
    this.setSelectedRef = (element) => {
      this.selectedRef = element;
    };
    this.focusSelectedRef = () => {
      if (this.selectedRef) {
        // this.selectedRef.focus();
        this.selectedRef.scrollIntoView({
          block: "center",
          behavior: "auto", //"smooth"
        });
      }
    };
    this.state = {
      isListOpened: false,
      selectedItem: this.props.list && this.props.list.find((item) => item === this.props.defaultValue),
    };
  }

  handleClickOutside = (e) => {
    this.setState({
      isListOpened: false,
    });
  };

  handleItemClick = (item) => {
    this.props.handleSelectItem(item);
    this.setState({ selectedItem: item, isListOpened: false });
  };
  handleToggleList = () => {
    this.setState((state) => {
      return { isListOpened: !state.isListOpened };
    }, this.focusSelectedRef);
  };

  render() {
    let { list, isAlert } = this.props;
    let { isListOpened, selectedItem } = this.state;
    let listToggle = isListOpened ? "on" : "off";
    return (
      <div className={`DD ${isAlert && "alert"}`}>
        <div className="DD__header" onClick={this.handleToggleList}>
          {selectedItem && <div className="DD__title">{selectedItem}</div>}
          {!selectedItem && <div className="DD__defaultValue">{this.props.defaultValue}</div>}
          <div className={`DD__arrow DD__arrow--${listToggle}`} />
        </div>
        <div className="DD__body">
          {isListOpened && (
            <div className="DD__list">
              {list.map((item, index) => {
                let isSelected = selectedItem === item;
                let itemToggle = isSelected ? "on" : "off";
                if (isSelected) {
                  return (
                    <div
                      key={index}
                      className={`DD__item DD__item--${itemToggle}`}
                      onClick={() => this.handleItemClick(item)}
                      ref={this.setSelectedRef}
                    >
                      {item}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className={`DD__item DD__item--${itemToggle}`}
                      onClick={() => this.handleItemClick(item)}
                    >
                      {item}
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default onClickOutside(DropDown);
