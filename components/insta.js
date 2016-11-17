import React from 'react'
import { IndexRoute, Router, Route, Link, hashHistory, browserHistory } from 'react-router'
import { addPic } from '../actions'
import  request  from 'superagent'

class Insta extends React.Component {
    constructor(){
        super()
    }
    componentWillMount() {
        const { dispatch } = this.props
        dispatch({type: 'RESET_PIC'})
 
      request
            .get('http://localhost:5000/api/pictures')
            .end((err, res) => {
                if (err) {
                    return;
                }
                const data = JSON.parse(res.text);
                let i = 0;
                data.map(item =>
                    setTimeout(() => {
                        dispatch(addPic(item))
                        i++;
                    }, 0)

                )


            })
    }
    render() {
        const { pictures, onLikeClick } = this.props
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
                                        <Link to={{ pathname: '/view', query: { id: pic.id } }} className="instabtn btn btn-default">
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