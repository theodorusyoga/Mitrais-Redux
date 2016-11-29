import React from 'react'
import { Link } from 'react-router'
import { addPic } from '../actions'
import request from 'superagent'

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Subheader from 'material-ui/Subheader'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import { IconMenu, MenuItem } from 'material-ui/IconMenu'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey400, darkBlack, lightBlack } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton'
import AppBar from 'material-ui/AppBar'
import FontIcon from 'material-ui/FontIcon'

require('superagent-auth-bearer')(request)

var commentbox;
var editcommentdiv = []; //untuk dynamic control div
var editcommentbox = []; //untuk dynamic control textbox
var commenttext = []; //untuk dynamic control text commentnya

class InstaDetails extends React.Component {


    componentWillUpdate(nextProps, nextState) {
        let { editcomment } = nextProps
        let { dispatch, login, onEditExecute } = this.props
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
                onEditExecute(editcomment.id, login.accesstoken, editcommentbox[i].value)
            }
        }
    }
    componentWillUnmount() {
        const { dispatch, login } = this.props

        dispatch({ type: 'RESET_COMMENT_EDIT' })
        editcommentdiv = []; //untuk dynamic control div
        editcommentbox = []; //untuk dynamic control textbox
        commenttext = [];

    }
    render() {
        const { id, snackbar, onSnackbarClose, picture, comment, comments, login, onClick, onLikeClick, onUnlikeClick, onDeleteCommentClick,
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
        let nolike = {
            color: 'black'
        }
        let withlike = {
            color: 'red'
        }
        const iconButtonElement = (
            <IconButton
                touch={true}
                tooltip="More"
                tooltipPosition="bottom-left"
                >
                <MoreVertIcon color={grey400} />
            </IconButton>
        );
        const rightIconMenu = (item, login) => (
            <IconMenu iconButtonElement={iconButtonElement}>
                <MenuItem onClick={() => onEditClick(item)}>Edit</MenuItem>
                <MenuItem onClick={() => onDeleteCommentClick(item, login.accesstoken)}>Delete</MenuItem>
            </IconMenu>
        );
        return (
            <div className="x_content">
                <div className="row">
                    <AppBar title="FAKESTAGRAM"
                        iconElementLeft={
                            <IconButton href="/#/"><FontIcon className="glyphicon glyphicon-circle-arrow-left"></FontIcon></IconButton>
                        }></AppBar>

                </div>
                <div>
                    <Snackbar bodyStyle={{ backgroundColor: '#333333' }} open={snackbar.isOpen || false}
                        message={snackbar.message || ''}
                        autoHideDuration={4000}
                        onRequestClose={onSnackbarClose} />
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        
                    </div>
                </div>
                <div className="row">
                    <Card>
                        <CardHeader title="Picture Details" avatar="/images/user.png" />
                        <CardMedia overlay={<CardTitle subtitle={picture.desc} />}>
                            <img src={picture.src} />
                        </CardMedia>
                        <CardActions>
                            <RaisedButton onTouchTap={picture.liked ? () => onUnlikeClick(picture, login.accesstoken) : () => onLikeClick(picture, login.accesstoken)}><span style={picture.liked ? withlike : nolike}><b>{picture.likes}</b>&nbsp;<span className="glyphicon glyphicon-heart"></span></span></RaisedButton>
                            <RaisedButton><b>{picture.comments_amt}</b>&nbsp;<span className="glyphicon glyphicon-comment"></span></RaisedButton>
                            <List>
                                <Subheader><b style={{ color: '#000000', fontSize: 16 }}>COMMENTS</b></Subheader>
                                {comments.map((item, i) =>
                                    <ListItem key={i} secondaryTextLines={2}
                                        leftAvatar={<Avatar src="http://i9.photobucket.com/albums/a88/creaticode/avatar_1_zps8e1c80cd.jpg" />}
                                        rightIconButton={rightIconMenu(item, login)}
                                        primaryText={<div style={{ color: '#000000' }}>{item.name}&nbsp;<small> - {item.time}</small></div>}
                                        secondaryText={
                                            <div>
                                                <p id={item.id + '_span'} ref={node => commenttext[i] = node}>
                                                    {item.text}
                                                </p>
                                                <div id={item.id + '_div'} ref={node => editcommentdiv[i] = node} style={editstylenone}>
                                                    <div className="col-md-6 col-sm-6">
                                                        <input ref={node => editcommentbox[i] = node} type="text" id={item.id} className="form-control" placeholder="Edit comment..." />
                                                    </div>
                                                    <div className="col-md-6 col-sm-6">
                                                        <FlatButton backgroundColor="#a4c639" style={{ color: '#FFFFFF' }} id={item.id + '_save'} onTouchTap={() => onSaveCommentClick(item.id)}><span className="glyphicon glyphicon-floppy-disk"></span>&nbsp;Save</FlatButton>
                                                        <FlatButton backgroundColor="#E9573F" style={{ color: '#FFFFFF' }} secondary={true} id={item.id + '_cancel'} onTouchTap={() => onCancelEditClick(item)}><span className="glyphicon glyphicon-remove"></span>&nbsp;Cancel</FlatButton>
                                                    </div>
                                                </div>
                                            </div>
                                        } />


                                )}
                            </List>
                            <div className="widget-area no-padding blank">
                                <div className="status-upload">
                                    <textarea ref={node => commentbox = node} placeholder="What are you thinking about this picture?" ></textarea>
                                    <button type="submit" onClick={() => onClick(id, login.fullname, commentbox, login.accesstoken)} className="btn btn-success green"><i className="fa fa-share"></i> Share</button>
                                </div>
                            </div>
                        </CardActions>
                    </Card>
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