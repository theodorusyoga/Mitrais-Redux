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

      dispatch({
                        type: 'REMOVE_LIKE', id: pic.id, desc: pic.desc, src: pic.src,
                        likes: pic.likes, comments_amt: pic.comments_amt
                    })
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


}

const likePic = (pic, token, dispatch) => {
 dispatch({
                        type: 'ADD_LIKE', id: pic.id, desc: pic.desc, src: pic.src,
                        likes: pic.likes, comments_amt: pic.comments_amt
                    })

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
}

const openDetails = (id, token, dispatch) => {
    dispatch({ type: 'CLEAR_PIC' })
    dispatch({ type: 'RESET_COMMENT' })
    NProgress.start();

 request
    .get('../json/pictures.json')
    .end((err, res) => {
        var data = JSON.parse(res.text)
        let i = data.findIndex(p => p.id == id)
        var pic = data[i]
        pic.type = 'GET_PIC'
        dispatch(pic)

         NProgress.done()
    })

    request
    .get('../json/comments.json')
    .end((err, res) => {
        var data = JSON.parse(res.text)
        let comments = data.filter(p => p.pictureid == id)
        dispatch({type: 'GET_COMMENTS', comments: comments, comments_amt: comments.length})
    })
    //REST API
    // request
    //     .post('http://localhost:5000/api/picture')
    //     .authBearer(token)
    //     .send({ id: id })
    //     .type('form')
    //     .end(function (err, res) {
    //         if (err || !res.ok) {
    //             alert("There's an error while loading picture");
    //         } else {
    //             let data = res.body;
    //             //add dispatch action
    //             data.type = 'GET_PIC';

    //             dispatch(data)

    //             //comments
    //             if (data.comments_amt > 0) {
    //                 dispatch({ type: 'GET_COMMENTS', comments: data.comments, comments_amt: data.comments_amt })
    //             }


    //             NProgress.done();
    //         }
    //     });
}

const load = (token, dispatch) => {
    dispatch({ type: 'CLEAR_PICTURES' })
    NProgress.start()

//get local data
    request
    .get('../json/pictures.json')
    .end((err, res) => {
        var data = JSON.parse(res.text)
         dispatch({ type: 'STORE_PICTURES', pictures: data })
         NProgress.done()
    })

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
        onLoad: (token) =>
            load(token, dispatch)
        ,
        dispatch

    }
}

const InstaList = connect(mapStateToProps, mapDispatchToProps)(Insta)

export default InstaList