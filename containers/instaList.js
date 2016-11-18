import { connect } from 'react-redux'
import Insta from '../components/insta'
import request from 'superagent'

const openDetails = (id, dispatch) => {
    dispatch({ type: 'CLEAR_PIC' })
    dispatch({ type: 'RESET_COMMENT' })
    NProgress.start();
    request
        .post('http://localhost:5000/api/picture')
        .send({ id: id })
        .type('form')
        .end(function (err, res) {
            if (err || !res.ok) {
                alert("There's an error while loading picture");
            } else {
                let data = res.body;
                //add dispatch action
                data.type = 'GET_PIC';
                
                dispatch(data)

                //comments
                if (data.comments_amt > 0) {
                    data.comments.map(item => {
                        item.type = 'ADD_COMMENT'
                        dispatch(item)
                    })
                }


                NProgress.done();
            }
        });
}

const mapStateToProps = (state) => {
    return {
        pictures: state.pictures
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLikeClick: (pic) => {
            dispatch({
                type: 'ADD_LIKE', id: pic.id, desc: pic.desc, src: pic.src,
                likes: pic.likes, comments_amt: pic.comments_amt
            })
        },
        onOpenClick: (id) =>
            openDetails(id, dispatch)
        ,
        dispatch

    }
}

const InstaList = connect(mapStateToProps, mapDispatchToProps)(Insta)

export default InstaList