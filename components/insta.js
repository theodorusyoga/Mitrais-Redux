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
        request
            .get('http://localhost:5000/api/pictures/')
            .authBearer(accesstoken)
            .use(this.bearer.bind(this))
            .end((err, res) => {
                if (err) {
                    hashHistory.push('/')
                    return;
                }
                const data = JSON.parse(res.text);
                let i = 0;
                dispatch({ type: 'STORE_PICTURES', pictures: data })
            })




    }
    render() {
        const { pictures, onLikeClick, onOpenClick, onLogout } = this.props
        return (
            <div className="x_content">
                <div className="row">
                    <div className="col sm-12 col-md-12">
                        <button onClick={() => onLogout()} className="pull-right btn btn-danger"><span className="glyphicon glyphicon-log-out"></span>&nbsp;Log Out</button>
                    </div>
                </div>
                <br/>
                <div className="row">
                    {pictures.map((pic, i) =>
                        <div key={pic.id} className="col-sm-6 col-md-4">
                            <div className="thumbnail">
                                <div className="img">
                                    <img src={pic.src} height="250" width="250" /></div>
                                <div className="caption">
                                    <p>{pic.desc}</p>
                                    <br />
                                    <p><button onClick={() => onLikeClick(pic)} href="#" className="instabtn btn btn-default" role="button">
                                        <b>{pic.likes}</b>&nbsp;<span className="glyphicon glyphicon-heart"></span></button>
                                        <Link onClick={() => onOpenClick(pic.id)} to={{ pathname: '/view', query: { id: pic.id } }} className="instabtn btn btn-default">
                                            <b>{pic.comments_amt}</b>&nbsp;
                                        <span className="glyphicon glyphicon-comment"></span></Link></p>
                                </div>
                            </div>
                        </div>

                    )}

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