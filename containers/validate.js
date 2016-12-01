import { connect } from 'react-redux'
import Login from '../components/login'
import request from 'superagent'
import cookie from 'react-cookie'
import { hashHistory } from 'react-router'
import fs from 'fs'


var lsfs = new BrowserFS.FileSystem.LocalStorage();
BrowserFS.initialize(lsfs);
BrowserFS.install(window);

const onLoginClick = (username, pwd, dispatch) => {
    NProgress.start();

    //get users local data

    fs.readFile('/users.json', (err, contents) => {
        var data = JSON.parse(contents)
        var i = data.findIndex(p => p.username == username && p.password == pwd)
        if (i != -1) { //if found
            cookie.save('username', username)
            cookie.save('password', pwd)
            cookie.save('fullname', 'Dummy User')
            cookie.save('accesstoken', '')
            cookie.save('expires', 0)
            dispatch({
                type: 'GET_ACCESSTOKEN',
                username: username,
                password: pwd,
                fullname: 'Dummy User',
                accesstoken: '',
                expires: 0
            })
            NProgress.done()
            hashHistory.push('/home')
        }
        else {
            alert('Invalid username or password!')
        }
    })

    // REST API section

    // request
    //     .post('http://localhost:5000/token')
    //     .send({ username: username, password: pwd })
    //     .type('form')
    //     .end((err, res) => {
    //         if (err || !res.ok) {
    //             alert(res.text)
    //         }
    //         else {
    //             var data = JSON.parse(res.text)
    //             var date = new Date();
    //             date.setHours(date.getHours(),
    //                 date.getMinutes(), date.getSeconds() + data.expires_in)
    //             cookie.save('username', username)
    //             cookie.save('password', pwd)
    //             cookie.save('fullname', data.fullname)
    //             cookie.save('accesstoken', data.access_token)
    //             cookie.save('expires', date)
    //             dispatch({
    //                 type: 'GET_ACCESSTOKEN',
    //                 username: username,
    //                 password: pwd,
    //                 fullname: data.fullname,
    //                 accesstoken: data.access_token,
    //                 expires: data.expires_in
    //             })
    //             NProgress.done()
    //             hashHistory.push('/home')

    //         }
    //     })

    //end of REST API
}

const load = (dispatch) => {

    //populate browserFS from local file first
    fs.readFile('/users.json', (err, contents) => {
        if (err) {
            request
                .get('../json/users.json')
                .end((end, res) => {
                    fs.writeFile('/users.json', res.text)
                })
        }
    })

    let token = cookie.load('accesstoken')
    let expires = cookie.load('expires')
    let username = cookie.load('username')
    let pwd = cookie.load('password')
    let fullname = cookie.load('fullname')
    //UNCOMMENT THIS CONDITION IF USING REST API
    // if (token != '' && token != undefined) {
    if (expires != null) {
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
        else { //if expired
            onLoginClick(username, pwd, dispatch);
        }
    }



    //  }
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
        onLoad: () =>
            load(dispatch),
        dispatch
    }
}

const Validate = connect(mapStateToProps, mapDispatchToProps)(Login)

export default Validate