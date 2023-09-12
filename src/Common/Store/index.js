import { createStore, applyMiddleware } from "redux";
import Reducer from "./Reducer";
import { createLogger } from "redux-logger";

const configure = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    return createStore(Reducer, applyMiddleware(createLogger()));
  } else {
    return createStore(Reducer);
  }
};

export default configure();
