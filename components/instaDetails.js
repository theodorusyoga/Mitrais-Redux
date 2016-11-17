import React from 'react'
import { Link } from 'react-router'

var src;
var desc;

class InstaDetails extends React.Component {
    componentWillMount() {
        const { id, dispatch } = this.props
        var data = { type: 'GET_PIC', id: id }
        dispatch(data)

    }
    reset(e) {
        const { dispatch } = this.props
        dispatch({ type: 'RESET_PIC' })
    }
    render() {

        const { id, picture } = this.props
        return (
            <div className="x_content">
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <Link onClick={this.reset.bind(this)} to="/" className="btn btn-default"><span className="glyphicon glyphicon-circle-arrow-left"></span> Back</Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <a href="#" className="thumbnail">
                            <img src={picture.src} alt="..." />
                        </a>
                    </div>
                    <small>{picture.desc}</small>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12">
                        <p><a href="#" className="instabtn btn btn-default" role="button">
                            <b>{picture.likes}</b>&nbsp;<span className="glyphicon glyphicon-heart"></span></a>
                            <Link to={{ pathname: '/view', query: { id: 0 } }} className="instabtn btn btn-default">
                                <b>{picture.comments_amt}   </b>&nbsp;
                                        <span className="glyphicon glyphicon-comment"></span></Link></p>
                    </div>
                </div>
            </div>
        )
    }
}

export default InstaDetails