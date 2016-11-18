import React from 'react'
import { IndexRoute, Router, Route, Link, hashHistory, browserHistory } from 'react-router'
import { addPic } from '../actions'

class Insta extends React.Component {

    render() {
        const { pictures, onLikeClick, onOpenClick } = this.props
        return (
            <div className="x_content">
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

export default Insta