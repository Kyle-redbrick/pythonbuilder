import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Test from "./Page/Test";
import Python from "./Page/Python";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Test}></Route>
      <Route exact path="/python" component={Python}></Route>
    </Router>
  );
}

export default App;
