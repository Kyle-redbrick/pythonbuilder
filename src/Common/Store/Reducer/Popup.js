import { ActionType } from "../../Util/Constant";

export const setMainPopup = (mainPopup, eventMessage = false) => ({
  type: ActionType.SET_MAIN_POPUP,
  mainPopup,
  eventMessage,
});

const initialState = {
  mainPopup: null,
  eventMessage: false,
};

const popup = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.SET_MAIN_POPUP:
      return { ...state, mainPopup: action.mainPopup, eventMessage: action.eventMessage };
    default:
      return state;
  }
};

export default popup;
