import { connect } from 'react-redux'
import Login from '../components/login'

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

const Validate = connect(mapStateToProps, mapDispatchToProps)(Login)

export default Validate