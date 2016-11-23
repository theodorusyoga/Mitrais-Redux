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
                    return;
                }
                const data = JSON.parse(res.text);
                let i = 0;
                dispatch({ type: 'STORE_PICTURES', pictures: data })
            })



        // $.ajax({
        //     type: "GET",
        //     url: 'https://localhost:44372/api/pictures',
        //     beforeSend: function (xhr) { 
        //         console.log('header added')
        //         xhr.withCredentials = true;
        //         xhr.setRequestHeader('Authorization', 'Bearer ' + accesstoken); 
        //     xhr.setRequestHeader('Cache-Control', 'no-cache'); },
        //     success: (data) => {
        //         console.log(data)
        //     }

        // });



        // var xhttp = new XMLHttpRequest();
        // xhttp.onreadystatechange = function () {
        //     if (this.readyState == 4 && this.status == 200) {
        //         // Typical action to be performed when the document is ready:
        //         console.log(xhttp.responseText);
        //     }
        // };
        // xhttp.open("GET", "http://localhost:5000/api/pictures/", true);
        // xhttp.setRequestHeader("Authorization", 'Bearer ' + accesstoken);
        // xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        // xhttp.setRequestHeader("Accept", 'testing');
        // xhttp.setRequestHeader('X-Alt-Referer', 'http://localhost:8080');
        // xhttp.responseType = 'text';
        // xhttp.withCredentials = true;
        //  console.log(xhttp)
        // xhttp.send();

        // var obj = {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': 'Bearer ' + accesstoken,
        //         'Content-Type': 'application/json',
        //         'X-Requested-With': 'XMLHttpRequest'
        //     },
        // }

        // fetch("http://localhost:5000/api/pictures/", obj)
        //     .then((response) => {
        //         console.log(response)
        //     })
        //     .then((json) => {
        //         console.log(json)
        //     });
    }
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