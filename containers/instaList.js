import { connect } from 'react-redux';
import Insta from '../components/insta';
import request from 'superagent';
import cookie from 'react-cookie';
import { hashHistory } from 'react-router';
import fs from 'fs';

/*global require*/
/*global NProgress*/

require('superagent-auth-bearer')(request);


const logout = (dispatch) => {
    cookie.remove('username');
    cookie.remove('password');
    cookie.remove('accesstoken');
    cookie.remove('expires');
    dispatch({ type: 'CLEAR_CREDENTIAL' });
    dispatch({ type: 'CLEAR_PICTURES' });
    hashHistory.push('/');
};

const dislikePic = (pic, token, dispatch) => {
    dispatch({
        type: 'REMOVE_LIKE', id: pic.id, desc: pic.desc, src: pic.src,
        likes: pic.likes, comments_amt: pic.comments_amt
    });

    //browserFS
    fs.readFile('/pictures.json', (err, content) => {
        if (!err) {
            var data = JSON.parse(content);
            var i = data.findIndex(p => p.id === pic.id);
            data[i].likes -= 1;
            data[i].liked = false;
            fs.writeFile('/pictures.json', JSON.stringify(data));
        }
    });
    // REST API
    // request
    //     .post('http://localhost:5000/api/pictures/unlike')
    //     .send({ PictureID: pic.id })
    //     .authBearer(token)
    //     .type('form')
    //     .end(function (err, res) {
    //         if (err || !res.ok) {
    //             alert("There's an error while loading picture");
    //         } else {
    //             let data = res.body;
    //             //add dispatch action
    //             if (data.status == 0) {

    //             }
    //             else {
    //                 alert('There is something wrong.')
    //             }
    //             NProgress.done();
    //         }
    //     });
};

const likePic = (pic, token, dispatch) => {
    dispatch({
        type: 'ADD_LIKE', id: pic.id, desc: pic.desc, src: pic.src,
        likes: pic.likes, comments_amt: pic.comments_amt
    });

    //browserFS
    fs.readFile('/pictures.json', (err, content) => {
        if (!err) {
            var data = JSON.parse(content);
            var i = data.findIndex(p => p.id === pic.id);
            data[i].likes += 1;
            data[i].liked = true;
            fs.writeFile('/pictures.json', JSON.stringify(data));
        }
    });

    //REST API
    // request
    //     .post('http://localhost:5000/api/pictures/like')
    //     .send({ PictureID: pic.id })
    //     .authBearer(token)
    //     .type('form')
    //     .end(function (err, res) {
    //         if (err || !res.ok) {
    //             alert("There's an error while loading picture");
    //         } else {
    //             let data = res.body;
    //             //add dispatch action
    //             if (data.status == 0) {

    //             }
    //             else {
    //                 alert('There is something wrong.')
    //             }
    //             NProgress.done();
    //         }
    //     });
};

const load = (token, dispatch) => {
    dispatch({ type: 'CLEAR_PICTURES' });
    NProgress.start();
    //populate from local file
    fs.readFile('/pictures.json', (err, content) => {
        if (err) {
            request
                .get('../json/pictures.json')
                .end((err, res) => {
                    fs.writeFile('/pictures.json', res.text);
                    var data = JSON.parse(res.text);

                    dispatch({ type: 'STORE_PICTURES', pictures: data });
                    NProgress.done();
                });
        } else {
            var data = JSON.parse(content);
            dispatch({ type: 'STORE_PICTURES', pictures: data });
            NProgress.done();
        }
    });

    // REST API section
    // request
    //     .get('http://localhost:5000/api/pictures/')
    //     .authBearer(token)
    //     .end((err, res) => {
    //         if (err) {
    //             hashHistory.push('/')
    //             return;
    //         }
    //         const data = JSON.parse(res.text);
    //         let i = 0;
    //         dispatch({ type: 'STORE_PICTURES', pictures: data })
    //         NProgress.done()
    //     })
    // end REST API section
};

const mapStateToProps = (state) => {
    return {
        pictures: state.pictures,
        login: state.login
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
        onLikeClick: (pic, token) => {
            likePic(pic, token, dispatch);
        },
        onDislikeClick: (pic, token) => {
            dislikePic(pic, token, dispatch);
        },
        onLogout: () => {
            logout(dispatch);
        },
        onLoad: (token) =>
            load(token, dispatch)
    };
};

const InstaList = connect(mapStateToProps, mapDispatchToProps)(Insta);

export default InstaList;
