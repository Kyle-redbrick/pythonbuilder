import { ActionType } from "../../Util/Constant";

// create actions
export const updateUserInfo = (userinfo) => ({
  type: ActionType.UPDATE_USERINFO,
  payload: userinfo,
});

export const addPoint = (levelPoint, availablePoint) => ({
  type: ActionType.ADD_POINT,
  levelPoint: levelPoint,
  availablePoint: availablePoint,
});

const initialState = {};

const userinfo = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.UPDATE_USERINFO:
      if (!action.payload) {
        return {};
      } else {
        return { ...state, ...action.payload };
      }
    case ActionType.ADD_POINT:
      return {
        ...state,
        levelPoint: state.levelPoint + action.levelPoint,
        availablePoint: state.availablePoint + action.availablePoint,
      };
    default:
      return state;
  }
};

export default userinfo;
