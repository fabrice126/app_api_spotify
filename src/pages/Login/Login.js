import React from 'react';
import LoginButton from "../../components/LoginButton/LoginButton";
import "../Login/Login.css";

class Login extends React.Component {

    render() {
        console.log(this.props)
        return (
            <div id="Login" className="d-flex justify-content-center align-self-center">
                <LoginButton />
            </div>
        )
    }
}


export default Login;