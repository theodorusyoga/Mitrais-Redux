import { connect } from 'react-redux';
import  Panel  from '../components/panel';

const mapStateToProps = (state) => {
    return {
        todos: state.append
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
};

const PanelTodo = connect(mapStateToProps, mapDispatchToProps)(Panel);

export default PanelTodo;