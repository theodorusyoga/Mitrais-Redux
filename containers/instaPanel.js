import { connect } from 'react-redux'
import InstaDetails from '../components/instaDetails'
import request from 'superagent'
import { addComment } from '../actions'
import { formatDate } from './datetimeFormatter'

const initiateSaveComment = (id, dispatch) => {
    dispatch({ type: 'INITIATE_SAVE_COMMENT', id: id })
}

const cancelEditComment = (item, dispatch) => {
    dispatch({ type: 'CANCEL_COMMENT', id: item.id, text: item.text })
}

const editComment = (item, dispatch) => {
    dispatch({ type: 'EDIT_COMMENT', id: item.id, text: item.text })
}

const deleteComment = (item, dispatch) => {
    if (!confirm('Do you want to remove this comment?'))
        return;
    dispatch({
        type: 'REMOVE_COMMENT', id: item.id,
        name: item.name, pictureid: item.pictureid,
        time: item.time
    })
    request
        .post('http://localhost:5000/api/comments/delete')
        .send({ id: item.id })
        .type('form')
        .end(function (err, res) {
            if (err || !res.ok) {
                alert("There's an error while deleting comment");
            } else {
                let data = res.body;
                //add dispatch action

                NProgress.done();
            }
        });
}

const likePic = (pic, dispatch) => {
    request
        .post('http://localhost:5000/api/pictures/like')
        .send({ id: pic.id })
        .type('form')
        .end(function (err, res) {
            if (err || !res.ok) {
                alert("There's an error while liking picture");
            } else {
                let data = res.body;
                //add dispatch action
                if (data.status == 0) {
                    dispatch({
                        type: 'ADD_LIKE_PIC', id: pic.id, desc: pic.desc, src: pic.src,
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

const onClick = (id, input, dispatch) => {
    NProgress.start();
    request
        .post('http://localhost:5000/api/comments/create')
        .send({
            Name: 'Author',
            Text: input.value.trim(),
            PictureID: Number(id),
            Time: formatDate(new Date())
        })
        .type('form')
        .end(function (err, res) {
            if (err || !res.ok) {
                alert("There's an error while posting comment");
            } else {
                let data = res.body;
                let disp = addComment(data)
                dispatch(disp);

                NProgress.done();
            }
        });
    input.value = ''
}

const mapStateToProps = (state, ownProps) => {
    return {
        id: state.routing.locationBeforeTransitions.query.id,
        picture: state.picdetails,
        comments: state.comments,
        editcomment: state.comment
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: (id, input) =>
            onClick(id, input, dispatch)
        ,
        onLikeClick: (pic) =>
            likePic(pic, dispatch)
        ,
        onDeleteCommentClick: (item) =>
            deleteComment(item, dispatch)
        ,
        onEditClick: (item) =>
            editComment(item, dispatch)
        ,
        onCancelEditClick: (item) =>
            cancelEditComment(item, dispatch)
        ,
        onSaveCommentClick: (id) =>
            initiateSaveComment(id, dispatch)
        ,
        dispatch
    }
}

const InstaPanel = connect(mapStateToProps, mapDispatchToProps)(InstaDetails)

export default InstaPanel