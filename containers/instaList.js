import { connect } from 'react-redux'
import Insta from '../components/insta'
import request from 'superagent'

const likePic = (pic, dispatch) => {
    request
        .post('http://localhost:5000/api/pictures/like')
        .send({ id: pic.id })
        .type('form')
        .end(function(err, res) {
            if (err || !res.ok) {
                alert("There's an error while loading picture");
            } else {
                let data = res.body;
                //add dispatch action
                if (data.status == 0) {
                    dispatch({
                        type: 'ADD_LIKE', id: pic.id, desc: pic.desc, src: pic.src,
                        likes: pic.likes, comments_amt: pic.comments_amt
                    })
                }
                else {
                    alert('There is something wrong.')
                }



                NProgress.done();
            }
        });
}

const openDetails = (id, dispatch) => {
    dispatch({ type: 'CLEAR_PIC' })
    dispatch({ type: 'RESET_COMMENT' })
    NProgress.start();
    request
        .post('http://localhost:5000/api/picture')
        .send({ id: id })
        .type('form')
        .end(function(err, res) {
            if (err || !res.ok) {
                alert("There's an error while loading picture");
            } else {
                let data = res.body;
                //add dispatch action
                data.type = 'GET_PIC';

                dispatch(data)

                //comments
                if (data.comments_amt > 0) {
                    dispatch({ type: 'GET_COMMENTS', comments: data.comments, comments_amt: data.comments_amt })
                }


                NProgress.done();
            }
        });
}

const mapStateToProps = (state) => {
    return {
        pictures: state.pictures,
        login: state.login
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLikeClick: (pic) => {
            likePic(pic, dispatch)
        },
        onOpenClick: (id) =>
            openDetails(id, dispatch)
        ,
        dispatch

    }
}

const InstaList = connect(mapStateToProps, mapDispatchToProps)(Insta)

export default InstaList