import { connect } from 'react-redux'
import Login from '../components/login'
import request from 'superagent'
import cookie from 'react-cookie'

const onLoginClick = (username, pwd, dispatch) => {
    NProgress.start();
    request
        .post('http://localhost:5000/token')
        .send({ username: username, password: pwd })
        .type('form')
        .end((err, res) => {
            if (err || !res.ok) {
                alert(res.text)
            }
            else {
                var data = JSON.parse(res.text)
                var date = new Date();
                date.setHours(date.getHours(), 
                date.getMinutes(), date.getSeconds() + data.expires_in)
                cookie.save('username', username)
                cookie.save('password', pwd)
                cookie.save('accesstoken', data.access_token)
                cookie.save('expires', date)
                dispatch({
                    type: 'GET_ACCESSTOKEN',
                    username: username,
                    password: pwd,
                    accesstoken: data.access_token,
                    expires: data.expires_in
                })

            }
        })
}

const mapStateToProps = (state) => {
    return {
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLoginClick: (username, pwd) =>
            onLoginClick(username, pwd, dispatch),
        dispatch
    }
}

const Validate = connect(mapStateToProps, mapDispatchToProps)(Login)

export default Validate