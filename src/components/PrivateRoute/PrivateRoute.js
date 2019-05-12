import React from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import getLocalStorageToken from "../../lib/getLocalStorageToken";

class PrivateRoute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: false,
      requestDone: false
    };
  }
  async componentDidMount() {
    try {
      const config = {
        headers: { Authorization: getLocalStorageToken("spotify") }
      };
      await axios.get(`https://api.spotify.com/v1/search?q=Metallica&type=artist&limit=1&offset=0`, config);
      this.setState({ auth: true, requestDone: true });
    } catch (error) {
      console.error(error);
      this.setState({ auth: false, requestDone: true });
    }
  }
  render() {
    const { auth, requestDone } = this.state;
    const { component: Component, ...rest } = this.props;
    if (!auth && requestDone) {
      return <Redirect to="/" />;
    } else if (auth && requestDone) {
      return <Route {...rest} component={Component} />;
    }
    return "";
  }
}

export default PrivateRoute;
