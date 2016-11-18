import React from 'react'
import { Link } from 'react-router'
import { addPic } from '../actions'
import request from 'superagent'

var commentbox;

class InstaDetails extends React.Component {
    componentWillUnmount() {
        const { dispatch } = this.props
        dispatch({ type: 'CLEAR_PICTURES' })
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

        const { id, picture, comments, onClick } = this.props
        var style = {
            width: '49.1%'
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
                        <p><a style={style} href="#" className="instabtn btn btn-default" role="button">
                            <b>{picture.likes}</b>&nbsp;<span className="glyphicon glyphicon-heart"></span></a>
                            <Link style={style} to={{ pathname: '/view', query: { id: 0 } }} className="instabtn btn btn-default">
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

                                            <i className="fa fa-times"></i>
                                            <i className="fa fa-pencil"></i>
                                        </div>
                                        <div className="comment-content">
                                            {item.text}
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

export default InstaDetails