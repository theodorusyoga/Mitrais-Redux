import { connect } from 'react-redux'
import InstaDetails from '../components/instaDetails'
import request from 'superagent'
import { addComment } from '../actions'
import { formatDate } from './datetimeFormatter'
import cookie from 'react-cookie'

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

const initiateSaveComment = (id, dispatch) => {
    dispatch({ type: 'INITIATE_SAVE_COMMENT', id: id })
}

const cancelEditComment = (item, dispatch) => {
    dispatch({ type: 'CANCEL_COMMENT', id: item.id, text: item.text })
}

const editComment = (item, dispatch) => {
    dispatch({ type: 'EDIT_COMMENT', id: item.id, text: item.text })
}

const onEditComment = (id, token, text) => {
    // REST API
    // NProgress.start()
    // request
    //     .post('http://localhost:5000/api/comments/update')
    //     .authBearer(token)
    //     .send({ id: id, text: text })
    //     .type('form')
    //     .end(function (err, res) {
    //         if (err || !res.ok) {
    //             alert("There's an error while updating comment");
    //         } else {
    //             NProgress.done()
    //         }
    //     });
}


const deleteComment = (item, token, dispatch) => {
    if (!confirm('Do you want to remove this comment?'))
        return;
    NProgress.start()
    dispatch({
        type: 'REMOVE_COMMENT', id: item.id,
        name: item.name, pictureid: item.pictureid,
        time: item.time
    })

    //REST API
    // request
    //     .post('http://localhost:5000/api/comments/delete')
    //     .authBearer(token)
    //     .send({ id: item.id })
    //     .type('form')
    //     .end(function (err, res) {
    //         if (err || !res.ok) {
    //             alert("There's an error while deleting comment");
    //         } else {
    //             let data = res.body;
    //             //add dispatch action

    //             NProgress.done();
    //         }
    //     });
}

const likePic = (pic, token, dispatch) => {
    dispatch({
        type: 'ADD_LIKE_PIC', id: pic.id, desc: pic.desc, src: pic.src,
        likes: pic.likes, comments_amt: pic.comments_amt
    })

    //REST API
    // request
    //     .post('http://localhost:5000/api/pictures/like')
    //     .authBearer(token)
    //     .send({ PictureID: pic.id })
    //     .type('form')
    //     .end(function (err, res) {
    //         if (err || !res.ok) {
    //             alert("There's an error while liking picture");
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

const unlikePic = (pic, token, dispatch) => {
    dispatch({
        type: 'REMOVE_LIKE_PIC', id: pic.id, desc: pic.desc, src: pic.src,
        likes: pic.likes, comments_amt: pic.comments_amt
    })
    //REST API
    // request
    //     .post('http://localhost:5000/api/pictures/unlike')
    //     .authBearer(token)
    //     .send({ PictureID: pic.id })
    //     .type('form')
    //     .end(function (err, res) {
    //         if (err || !res.ok) {
    //             alert("There's an error while liking picture");
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

const onClick = (id, author, input, dispatch, token) => {
    let data = {
        id: id,
        text: input.value.trim(),
        name: author,
        time: formatDate(new Date)
    }
    let disp = addComment(data)
    dispatch(disp);
    input.value = ''

    // REST API
    // NProgress.start();
    // request
    //     .post('http://localhost:5000/api/comments/create')
    //     .authBearer(token)
    //     .send({
    //         Name: author,
    //         Text: input.value.trim(),
    //         PictureID: Number(id),
    //         Time: formatDate(new Date())
    //     })
    //     .type('form')
    //     .end(function (err, res) {
    //         if (err || !res.ok) {
    //             alert("There's an error while posting comment");
    //         } else {
    //             NProgress.done();
    //         }
    //     });

}

const mapStateToProps = (state, ownProps) => {
    return {
        id: state.routing.locationBeforeTransitions.query.id,
        picture: state.picdetails,
        comments: state.comments,
        editcomment: state.editcomment,
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: (id, author, input, token) =>
            onClick(id, author, input, dispatch, token)
        ,
        onLikeClick: (pic, token) =>
            likePic(pic, token, dispatch)
        ,
        onUnlikeClick: (pic, token) =>
            unlikePic(pic, token, dispatch)
        ,
        onDeleteCommentClick: (item, token) =>
            deleteComment(item, token, dispatch)
        ,
        onEditClick: (item) =>
            editComment(item, dispatch)
        ,
        onEditExecute: (item, token, text) =>
            onEditComment(item, token, text)
        ,
        onCancelEditClick: (item) =>
            cancelEditComment(item, dispatch)
        ,
        onSaveCommentClick: (id) =>
            initiateSaveComment(id, dispatch)
        ,
        onLogout: () => {
            logout(dispatch)
        },
        dispatch
    }
}

const InstaPanel = connect(mapStateToProps, mapDispatchToProps)(InstaDetails)

export default InstaPanel