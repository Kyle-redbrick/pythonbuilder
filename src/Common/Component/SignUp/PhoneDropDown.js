import React, { Component } from "react";

import onClickOutside from "react-onclickoutside";
import "./PhoneDropDown.scss";
import I18NCountries from "i18n-iso-countries";
import { iso2ToDial } from "../../Util/CountryCode";
I18NCountries.registerLocale(require("i18n-iso-countries/langs/en.json"));
I18NCountries.registerLocale(require("i18n-iso-countries/langs/ko.json"));

class PhoneDropDown extends Component {
  constructor(props) {
    super(props);
    this.selectedRef = null;

    this.setSelectedRef = (element) => {
      this.selectedRef = element;
    };

    this.focusSelectedRef = () => {
      if (this.selectedRef) {
        this.selectedRef.scrollIntoView({
          block: "center",
          behavior: "auto",
        });
      }
    };
    // this.lang = localStorage.getItem("wizLang");
    // if (["ko", "en"].indexOf(this.lang) < 0) {
    //   this.lang = "en";
    // }
    this.lang = "ko";
    this.list = Object.keys(iso2ToDial)
      .map((country) => {
        return {
          name: I18NCountries.getName(country, this.lang),
          dialCode: iso2ToDial[country],
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    this.state = {
      isListOpened: false,
      selectedItem: this.list.find((item) => `+${item.dialCode}` === this.props.countryCode),
    };
  }

  handleClickOutside = (e) => {
    this.setState({
      isListOpened: false,
    });
  };

  handleItemClick = (item) => {
    this.props.handleSelectItem(`+${item.dialCode}`);
    this.setState({ selectedItem: item, isListOpened: false });
  };

  handleToggleList = () => {
    this.setState((state) => {
      return { isListOpened: !state.isListOpened };
    }, this.focusSelectedRef);
  };

  render() {
    let { phoneNum, phoneInputReadonly } = this.props;
    let { isListOpened, selectedItem } = this.state;
    let listToggle = isListOpened ? "on" : "off";
    return (
      <div className="PhoneDD">
        <div className={`PhoneDD__header ${this.props.warn ? "on" : "off"}`}>
          <div className="PhoneDD__countryRow" onClick={this.handleToggleList}>
            <div className="PhoneDD__title">{`+${selectedItem.dialCode}`}</div>
            <div className={`PhoneDD__arrow PhoneDD__arrow--${listToggle}`} />
          </div>
          <input
            className="PhoneDD__input"
            readOnly={phoneInputReadonly}
            type="text"
            name="phoneNum"
            value={phoneNum}
            onChange={this.props.handleInputChange}
            placeholder="- 없이 휴대전화번호 입력"
          />
        </div>
        {isListOpened && (
          <div className="PhoneDD__body">
            <div className="PhoneDD__list">
              {this.list.map((item, index) => {
                let isSelected = selectedItem.dialCode === item.dialCode;
                let itemToggle = isSelected ? "on" : "off";
                return (
                  <div
                    key={index}
                    className={`PhoneDD__item PhoneDD__item--${itemToggle}`}
                    onClick={() => this.handleItemClick(item)}
                    ref={isSelected ? this.setSelectedRef : null}
                  >
                    {`${item.name} (+${item.dialCode})`}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default onClickOutside(PhoneDropDown);
