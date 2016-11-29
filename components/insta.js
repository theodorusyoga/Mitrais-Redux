import React from 'react'
import { IndexRoute, Router, Route, Link, hashHistory, browserHistory } from 'react-router'
import { addPic } from '../actions'
import request from 'superagent'

require('superagent-auth-bearer')(request)


class Insta extends React.Component {
    bearer(request) {
        const { login } = this.props
        // "config" is a global var where token and other stuff resides
        let accesstoken = login.accesstoken
        if (accesstoken) {
            request.set('Authorization', 'Bearer ' + accesstoken)
        }
    }
    componentDidMount() {
        const { login, dispatch } = this.props
        let accesstoken = login.accesstoken
        dispatch({ type: 'CLEAR_PICTURES' })
        NProgress.start()
        request
            .get('http://localhost:5000/api/pictures/')
            .authBearer(accesstoken)
            .end((err, res) => {
                if (err) {
                    hashHistory.push('/')
                    return;
                }
                const data = JSON.parse(res.text);
                let i = 0;
                dispatch({ type: 'STORE_PICTURES', pictures: data })
                 NProgress.done()
            })
    }
    render() {
        const { pictures, onLikeClick, onDislikeClick, onOpenClick, onLogout, login } = this.props
        let nolike = {
            color: 'black'
        }
        let withlike = {
            color: 'red'
        }
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">

                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <a className="navbar-brand" href="/#/"><b>fakestagram</b></a>
                        </div>


                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav navbar-right">
                                <li><a onClick={() => onLogout()}  className="btn btn-danger navbar-btn" href="#"><span className="glyphicon glyphicon-log-out"></span>&nbsp;Log Out</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="x_content">
                    <br />
                    <div className="row">
                        {pictures.map((pic, i) =>
                            <div key={pic.id} className="col-sm-6 col-md-4">
                                <div className="thumbnail">
                                    <div className="img">
                                        <img src={pic.src} height="250" width="250" /></div>
                                    <div className="caption">
                                        <p>{pic.desc}</p>
                                        <br />
                                        <p><button onClick={pic.liked ? () => onDislikeClick(pic, login.accesstoken) : () => onLikeClick(pic, login.accesstoken)} href="#" className="instabtn btn btn-default" role="button">
                                            <span style={pic.liked ? withlike : nolike}><b>{pic.likes}</b>&nbsp;<span className="glyphicon glyphicon-heart"></span></span></button>
                                            <Link onClick={() => onOpenClick(pic.id, login.accesstoken)} to={{ pathname: '/view', query: { id: pic.id } }} className="instabtn btn btn-default">
                                                <b>{pic.comments_amt}</b>&nbsp;
                                        <span className="glyphicon glyphicon-comment"></span></Link></p>
                                    </div>
                                </div>
                            </div>

                        )}

                    </div>
                </div>
            </div>
        )
    }
}

Insta.propTypes = {
    pictures: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        src: React.PropTypes.string.isRequired,
        desc: React.PropTypes.string.isRequired,
        likes: React.PropTypes.number.isRequired,
        comments_amt: React.PropTypes.number.isRequired
    }).isRequired).isRequired,
    onOpenClick: React.PropTypes.func.isRequired,
    onLikeClick: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired
};

export default Insta