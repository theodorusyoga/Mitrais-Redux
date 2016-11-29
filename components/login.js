import React from 'react'
import { hashHistory } from 'react-router'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import cookie from 'react-cookie'
import TextField from 'material-ui/TextField'
import { blue500 } from 'material-ui/styles/colors'

var username;
var password;

class Login extends React.Component {
    componentDidMount() {
        const { dispatch, onLoginClick } = this.props
        let token = cookie.load('accesstoken')
        let expires = cookie.load('expires')
        let username = cookie.load('username')
        let pwd = cookie.load('password')
        let fullname = cookie.load('fullname')
        if (token != '' && token != undefined) { 
            if (new Date(expires) > new Date()) { //if still valid
                dispatch({
                    type: 'GET_ACCESSTOKEN',
                    username: username,
                    password: pwd,
                    fullname: fullname,
                    accesstoken: token,
                    expires: expires
                })
                hashHistory.push('/home')
            }
            else{ //if expired
                console.log('token refreshed')
                onLoginClick(username, pwd);
            }


        }

        console.log(username)
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.login.accesstoken != undefined && nextProps.login.accesstoken != '') {
            NProgress.done()
            hashHistory.push('/home')
        }
    }
    render() {
        const { onLoginClick } = this.props
        let underlinestyle = {
            color: blue500
        }
        return (
            <div>
                <div className="row">
                    <div className="col sm-12 col-md-12 pull-right">
                        <AppBar title="LOGIN TO FAKESTAGRAM"
                            iconElementRight={<FlatButton ><span className="glyphicon glyphicon-log-out"></span>&nbsp;LOG OUT</FlatButton>}></AppBar>
                    </div>
                </div>
            <div className="x_panel loginpanel">
           
                <div className="login-form-1">
                    <form id="login-form" className="text-left">
                        <div className="login-form-main-message"></div>
                        <div className="main-login-form">
                            <div className="login-group">
                                <div className="form-group">
                                    <label htmlFor="lg_username" className="sr-only">Username</label>
                                    <TextField ref={node => username = node} hintText="Enter your username" underlineStyle={underlinestyle}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lg_password" className="sr-only">Password</label>
                                      <TextField ref={node => password = node} hintText="Enter your password" type="password" underlineStyle={underlinestyle}/>
                                </div>
                                <div className="form-group login-group-checkbox">
                                    <input type="checkbox" id="lg_remember" name="lg_remember" />
                                    <label htmlFor="lg_remember">remember</label>
                                </div>
                            </div>
                            <button onClick={() => onLoginClick(username.input.value, password.input.value)} type="button" className="login-button"><i className="fa fa-chevron-right"></i></button>
                        </div>
                        <div className="etc-login-form">
                            <p>forgot your password? <a href="#">click here</a></p>
                            <p>new user? <a href="#">create new account</a></p>
                        </div>
                    </form>
                </div>  
            </div>
            </div>
        )
    }

}

export default Login