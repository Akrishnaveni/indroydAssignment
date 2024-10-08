import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainScreen from "./MainScreen";
import MobileScreen from "./MobileScreen"; // Import the new MobileScreen component

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={MainScreen} />
        <Route path="/join" component={MobileScreen} />{" "}
        {/* Route for the mobile screen */}
      </Switch>
    </Router>
  );
}

export default App;
