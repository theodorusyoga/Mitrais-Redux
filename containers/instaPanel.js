import { connect } from 'react-redux'
import  InstaDetails from '../components/instaDetails'

const mapStateToProps = (state, ownProps) => {
    return{
        id: state.routing.locationBeforeTransitions.query.id,
        picture: state.pictures
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        dispatch
    }
}

const InstaPanel = connect(mapStateToProps, mapDispatchToProps)(InstaDetails)

export default InstaPanel