import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "../Login/Login.js";
import AuthCallback from "../AuthCallback/AuthCallback.js";
import Artist from "../Artist/Artist.js";
import Album from "../Album/Album.js";
import Header from "../../components/Header/Header.js";
import PrivateRoute from "../../components/PrivateRoute/PrivateRoute.js";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary.js";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div id="App">
          <Header />
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/callback" exact component={AuthCallback} />
            <PrivateRoute path="/artist" exact component={Artist} />
            <PrivateRoute path="/artist/:artistId" exact component={Album} />
          </Switch>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
