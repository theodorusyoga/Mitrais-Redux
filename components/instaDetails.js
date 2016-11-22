import React from 'react'
import { Link } from 'react-router'
import { addPic } from '../actions'
import request from 'superagent'

var commentbox;
var editcommentdiv = []; //untuk dynamic control div
var editcommentbox = []; //untuk dynamic control textbox
var commenttext = []; //untuk dynamic control text commentnya

class InstaDetails extends React.Component {

    editComment(id, text) {
        NProgress.start()
        request
            .post('http://localhost:5000/api/comments/update')
            .send({ id: id, text: text })
            .type('form')
            .end(function (err, res) {
                if (err || !res.ok) {
                    alert("There's an error while updating comment");
                } else {
                    NProgress.done()
                }
            });
    }

    componentWillUpdate(nextProps, nextState) {
        let { editcomment } = nextProps
        let { dispatch } = this.props
        if (editcomment.id != undefined) {
            let i = editcommentdiv.findIndex(p => p.id == editcomment.id + '_div')
            let j = commenttext.findIndex(p => p.id == editcomment.id + '_span')

            if (editcomment.type == 'EDIT') {
                editcommentdiv[i].style.display = 'block'
                editcommentbox[i].value = nextProps.editcomment.text
                commenttext[j].style.display = 'none'
            }
            else if (editcomment.type == 'CANCEL') {
                editcommentdiv[i].style.display = 'none'
                editcommentbox[i].value = nextProps.editcomment.text
                commenttext[j].style.display = 'block'
            }
            else if (editcomment.type == 'SAVE') {
                editcommentdiv[i].style.display = 'none'
                commenttext[j].style.display = 'block'
                dispatch({
                    type: 'SAVE_COMMENT',
                    id: editcomment.id,
                    text: editcommentbox[i].value
                })
                this.editComment(editcomment.id, editcommentbox[i].value)
            }
        }
    }
    componentWillUnmount() {
        const { dispatch } = this.props
        dispatch({ type: 'CLEAR_PICTURES' })
        dispatch({ type: 'RESET_COMMENT_EDIT' })
        editcommentdiv = []; //untuk dynamic control div
        editcommentbox = []; //untuk dynamic control textbox
        commenttext = [];
        //load pictures data again to refresh
        request
            .get('http://localhost:5000/api/pictures')
            .end((err, res) => {
                if (err) {
                    return;
                }
                const data = JSON.parse(res.text);
                data.map(item => {
                    var add = addPic(item)
                    dispatch(add)
                })
            })
    }
    render() {
        const { id, picture, comment, comments, onClick, onLikeClick, onDeleteCommentClick,
            onEditClick, onCancelEditClick, onSaveCommentClick } = this.props
        var buttonstyle = {
            width: '49.1%'
        }
        var editstylenone = {
            display: 'none'
        }
        var editstyleblock = {
            display: 'block'
        }
        return (
            <div className="x_content">
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <Link to="/" className="btn btn-default"><span className="glyphicon glyphicon-circle-arrow-left"></span> Back</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <a href="#" className="thumbnail">
                            <img src={picture.src} alt="..." />
                        </a>
                        <p>{picture.desc}</p>
                    </div>

                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <p><button onClick={() => onLikeClick(picture)} style={buttonstyle} className="instabtn btn btn-default">
                            <b>{picture.likes}</b>&nbsp;<span className="glyphicon glyphicon-heart"></span></button>
                            <Link style={buttonstyle} to={{ pathname: '/view', query: { id: 0 } }} className="instabtn btn btn-default">
                                <b>{picture.comments_amt}   </b>&nbsp;
                                        <span className="glyphicon glyphicon-comment"></span></Link></p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <div className="comments-list">
                            {comments.map((item, i) =>
                                <div key={i} className="comment-main-level">
                                    <div className="comment-avatar"><img src="http://i9.photobucket.com/albums/a88/creaticode/avatar_1_zps8e1c80cd.jpg" alt=""></img></div>
                                    <div className="comment-box">
                                        <div className="comment-head">
                                            <h6 className="comment-name by-author"><a href="http://creaticode.com/blog">{item.name}</a></h6>
                                            <span>{item.time}</span>

                                            <i onClick={() => onDeleteCommentClick(item)} className="fa fa-times"></i>
                                            <i onClick={() => onEditClick(item)} className="fa fa-pencil"></i>
                                        </div>
                                        <div className="comment-content">
                                            <div id={item.id + '_span'} ref={node => commenttext[i] = node} >{item.text}</div>
                                            <div id={item.id + '_div'} ref={node => editcommentdiv[i] = node} style={editstylenone}>
                                                <input ref={node => editcommentbox[i] = node} type="text" id={item.id} className="form-control" placeholder="Edit comment..." />
                                                <button id={item.id + '_save'} onClick={() => onSaveCommentClick(item.id)} className="btn btn-success"><span className="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</button>
                                                <button id={item.id + '_cancel'} onClick={() => onCancelEditClick(item)} className="btn btn-danger"><span className="glyphicon glyphicon-remove"></span>&nbsp;Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <div className="widget-area no-padding blank">

                            <div className="status-upload">
                                <textarea ref={node => commentbox = node} placeholder="What are you thinking about this picture?" ></textarea>

                                <button type="submit" onClick={() => onClick(id, commentbox)} className="btn btn-success green"><i className="fa fa-share"></i> Share</button>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

InstaDetails.propTypes = {
    id: React.PropTypes.string.isRequired,
    picture: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        src: React.PropTypes.string.isRequired,
        desc: React.PropTypes.string.isRequired,
        likes: React.PropTypes.number.isRequired,
        comments_amt: React.PropTypes.number.isRequired
    }),
    comments: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        time: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
    }).isRequired).isRequired,
    onClick: React.PropTypes.func.isRequired,
    onLikeClick: React.PropTypes.func.isRequired,
    onDeleteCommentClick: React.PropTypes.func.isRequired,
    onEditClick: React.PropTypes.func.isRequired,
    onCancelEditClick: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired
};

export default InstaDetails