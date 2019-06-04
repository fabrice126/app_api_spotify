import React from 'react';
class AuthCallback extends React.Component {

    componentDidMount() {
        const access_token = this.getHashValue('access_token');
        const token_type = this.getHashValue('token_type');
        if (this.getHashValue('error')) {
            console.error(this.getHashValue('state'));
            console.error(this.getHashValue('error'));
        } else if(access_token && token_type) {
            window.localStorage.setItem("jwt-spotify", `${token_type} ${access_token}`)
            this.props.history.replace('/artist')
        } else {
            // 
        }
    }
    getHashValue(key) {
        var matches = window.location.hash.match(new RegExp(key + '=([^&]*)'));
        return matches ? matches[1] : null;
    }
    render() {
        return ""
    }
}


export default AuthCallback;