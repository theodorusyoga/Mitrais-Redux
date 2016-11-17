import { connect } from 'react-redux'
import  Insta from '../components/insta'

const mapStateToProps = (state) => {
    return{
        pictures: state.pictures
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
         onLikeClick: (pic) => {
           dispatch({type: 'ADD_LIKE', id: pic.id, desc:pic.desc, src:pic.src,
        likes: pic.likes, comments_amt: pic.comments_amt})
        },
        dispatch
       
    }
}

const InstaList = connect(mapStateToProps, mapDispatchToProps)(Insta)

export default InstaList