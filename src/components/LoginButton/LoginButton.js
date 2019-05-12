import React from "react";
import "./LoginButton.css";
import config from "../../config/index";
class LoginButton extends React.Component {
  async handleClickLogin(e) {
    window.location = `https://accounts.spotify.com/authorize?client_id=${config.key_api}&redirect_uri=http:%2F%2Flocalhost:3000%2Fcallback%2F&scope=user-read-private%20user-read-email&response_type=token&state=123`;
  }
  render() {
    return (
      <button id="LoginButton" className="align-middle btn btn-light col-sm-4 mx-4 cursor-pointer" onClick={this.handleClickLogin}>
        <div className="text-login">Login</div>
        <div className="img-spotify">
          <img src="/img/spotify.png" alt="Spotify logo" />
        </div>
      </button>
    );
  }
}

export default LoginButton;
