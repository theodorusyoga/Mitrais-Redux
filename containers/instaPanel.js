import { connect } from 'react-redux'
import InstaDetails from '../components/instaDetails'
import request from 'superagent'
import { addComment } from '../actions'
import { formatDate } from './datetimeFormatter'
import cookie from 'react-cookie'
import fs from 'fs'

require('superagent-auth-bearer')(request)

var commentindex;

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

    //browserFS
    fs.readFile('/comments.json', (err, content) => {
        var data = JSON.parse(content.toString())
        var index = data.findIndex(p => p.id == id)
        data[index].text = text
        fs.writeFile('/comments.json', JSON.stringify(data))
    })

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

    fs.readFile('/comments.json', (err, content) => {
        var data = JSON.parse(content.toString())
        var index = data.findIndex(p => p.id == item.id)
        var newdata = [
            ...data.slice(0, index),
            ...data.slice(index + 1)
        ]
        fs.writeFile('/comments.json', JSON.stringify(newdata))
    })

    //decrease amount of comment by 1
    fs.readFile('/pictures.json', (err, content) => {
        var data = JSON.parse(content.toString())
        var index = data.findIndex(p => p.id == item.pictureid)
        data[index].comments_amt -= 1
        fs.writeFile('/pictures.json', JSON.stringify(data))
    })

    Nprogress.done()

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

    //browserFS
    fs.readFile('/pictures.json', (err, content) => {
        if (!err) {
            var data = JSON.parse(content)
            var i = data.findIndex(p => p.id == pic.id)
            data[i].likes += 1
            data[i].liked = true
            fs.writeFile('/pictures.json', JSON.stringify(data))
        }
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

    //browserFS
    fs.readFile('/pictures.json', (err, content) => {
        if (!err) {
            var data = JSON.parse(content)
            var i = data.findIndex(p => p.id == pic.id)
            data[i].likes -= 1
            data[i].liked = false
            fs.writeFile('/pictures.json', JSON.stringify(data))
        }
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

    fs.readFile('/comments.json', (err, content) => {
        var data = JSON.parse(content.toString())
        var newdata = {
            id: commentindex + 1,
            name: author,
            text: input.value.trim(),
            pictureid: id,
            time: formatDate(new Date())
        }
        var newdata = [
            ...data,
            newdata
        ]
        fs.writeFile('/comments.json', JSON.stringify(newdata))
    })

    //increase amount of comment by 1
    fs.readFile('/pictures.json', (err, content) => {
        var data = JSON.parse(content.toString())
        var index = data.findIndex(p => p.id == id)
        data[index].comments_amt += 1
        fs.writeFile('/pictures.json', JSON.stringify(data))
    })

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

const load = (id, token, dispatch) => {
    dispatch({ type: 'CLEAR_PIC' })
    dispatch({ type: 'RESET_COMMENT' })
    NProgress.start();

    //read local file for pictures

    fs.readFile('/pictures.json', (err, content) => {
        if (!err) {
            var data = JSON.parse(content)
            let i = data.findIndex(p => p.id == id)
            var pic = data[i]
            pic.type = 'GET_PIC'
            dispatch(pic)

            NProgress.done()
        }
    })

    //read local file for comments
    fs.readFile('/comments.json', (err, content) => {
        if (err) {
            request
                .get('../json/comments.json')
                .end((err, res) => {
                    fs.writeFile('/comments.json', res.text, (err) => {
                        if (!err) {
                            fs.readFile('/comments.json', (err, content) => {
                                var data = JSON.parse(content.toString())
                                let comments = data.filter(p => p.pictureid == id)
                                
                                dispatch({ type: 'GET_COMMENTS', comments: comments, comments_amt: comments.length })
                            })
                        }
                    })
                })
        }
        else {
            var data = JSON.parse(content.toString())
            commentindex = data[data.length - 1].id
            let comments = data.filter(p => p.pictureid == id)
            dispatch({ type: 'GET_COMMENTS', comments: comments, comments_amt: comments.length })
        }
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
        onLoad: (id, token) =>
            load(id, token, dispatch)
        ,
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