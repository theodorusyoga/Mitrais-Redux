import React from 'react';

var username;
var password;

class Login extends React.Component {
    componentDidMount () {
        const { onLoad } = this.props;
        onLoad();
    }
    render () {
        const { onLoginClick } = this.props;
        return (
            <div className="loginpanel">
            <div className="loginbox">
                <div className="logo">login to fakestagram</div>
                <div className="login-form-1">
                    <form id="login-form" className="text-left">
                        <div className="login-form-main-message"/>
                        <div className="main-login-form">
                                <div className="login-group">
                                <div className="form-group">
                                    <label htmlFor="lg_username" className="sr-only">Username</label>
                                    <input ref={node => (username = node)} type="text" className="form-control" id="lg_username" name="lg_username" placeholder="username" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lg_password" className="sr-only">Password</label>
                                    <input ref={node => (password = node)} type="password" className="form-control" id="lg_password" name="lg_password" placeholder="password" />
                                </div>
                                <div className="form-group login-group-checkbox">
                                    <input type="checkbox" id="lg_remember" name="lg_remember" />
                                    <label htmlFor="lg_remember">remember</label>
                                </div>
                            </div>
                            <button onClick={() => onLoginClick(username.value, password.value)} type="button" className="login-button"><i className="fa fa-chevron-right"/></button>
                        </div>
                        <div className="etc-login-form">
                            <p>forgot your password? <a href="#">click here</a></p>
                            <p>new user? <a href="#">create new account</a></p>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        );
    }

}

export default Login;
