import { connect } from 'react-redux'
import Insta from '../components/insta'
import request from 'superagent'
import cookie from 'react-cookie'
import { hashHistory } from 'react-router'

require('superagent-auth-bearer')(request)


const logout = (dispatch) => {
    if (confirm('Are you sure you want to logout?')) {
        cookie.remove('username')
        cookie.remove('password')
        cookie.remove('accesstoken')
        cookie.remove('expires')
        dispatch({ type: 'CLEAR_CREDENTIAL' })
        dispatch({ type: 'CLEAR_PICTURES' })
        hashHistory.push('/')
    }

}

const dislikePic = (pic, token, dispatch) => {

    request
        .post('http://localhost:5000/api/pictures/unlike')
        .send({ PictureID: pic.id })
        .authBearer(token)
        .type('form')
        .end(function (err, res) {
            if (err || !res.ok) {
                alert("There's an error while loading picture");
            } else {
                let data = res.body;
                //add dispatch action
                if (data.status == 0) {
                    dispatch({
                        type: 'REMOVE_LIKE', id: pic.id, desc: pic.desc, src: pic.src,
                        likes: pic.likes, comments_amt: pic.comments_amt
                    })
                }
                else {
                    alert('There is something wrong.')
                }
                NProgress.done();
            }
        });


}

const likePic = (pic, token, dispatch) => {
    request
        .post('http://localhost:5000/api/pictures/like')
        .send({ PictureID: pic.id })
        .authBearer(token)
        .type('form')
        .end(function (err, res) {
            if (err || !res.ok) {
                alert("There's an error while loading picture");
            } else {
                let data = res.body;
                //add dispatch action
                if (data.status == 0) {
                    dispatch({
                        type: 'ADD_LIKE', id: pic.id, desc: pic.desc, src: pic.src,
                        likes: pic.likes, comments_amt: pic.comments_amt
                    })
                }
                else {
                    alert('There is something wrong.')
                }



                NProgress.done();
            }
        });
}

const openDetails = (id, token, dispatch) => {
    dispatch({ type: 'CLEAR_PIC' })
    dispatch({ type: 'RESET_COMMENT' })
    NProgress.start();
    request
        .post('http://localhost:5000/api/picture')
        .authBearer(token)
        .send({ id: id })
        .type('form')
        .end(function (err, res) {
            if (err || !res.ok) {
                alert("There's an error while loading picture");
            } else {
                let data = res.body;
                //add dispatch action
                data.type = 'GET_PIC';
                
                dispatch(data)

                //comments
                if (data.comments_amt > 0) {
                    dispatch({ type: 'GET_COMMENTS', comments: data.comments, comments_amt: data.comments_amt })
                }

                hashHistory.push('/view/')


                NProgress.done();
            }
        });
}

const mapStateToProps = (state) => {
    return {
        pictures: state.pictures,
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLikeClick: (pic, token) => {
            likePic(pic, token, dispatch)
        },
        onDislikeClick: (pic, token) => {
            dislikePic(pic, token, dispatch)
        },
        onOpenClick: (id, token) =>
            openDetails(id, token, dispatch)
        ,
        onLogout: () => {
            logout(dispatch)
        },
        dispatch

    }
}

const InstaList = connect(mapStateToProps, mapDispatchToProps)(Insta)

export default InstaList