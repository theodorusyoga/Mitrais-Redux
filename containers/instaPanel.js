import { connect } from 'react-redux'
import InstaDetails from '../components/instaDetails'
import request from 'superagent'
import { addComment } from '../actions'
import { formatDate } from './datetimeFormatter'

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
        .end(function(err, res) {
            if (err || !res.ok) {
                alert("There's an error while posting comment");
            } else {
                let data = res.body;
                let disp = addComment(data)
                console.log(disp)
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
        comments: state.comments
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: (id, input) => 
            onClick(id, input, dispatch)
        ,
        dispatch
    }
}

const InstaPanel = connect(mapStateToProps, mapDispatchToProps)(InstaDetails)

export default InstaPanel