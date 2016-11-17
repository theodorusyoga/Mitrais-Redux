import { connect } from 'react-redux';
import { getEmp, deleteEmp, initEmp } from '../actions';
import Emplist from '../components/emplist';

const getVisibleEmps = (emps) => {
  //const getVisibleTodos = (todos = [], filter) => {
  // switch (filter) {
  //     case 'SHOW_ALL':
  //         return todos;
  //     default:
  //         return todos;
  // }
  return emps;
}

const mapStateToProps = (state) => {
  return {
    emps: getVisibleEmps(state.emps)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onEmpClick: (obj) => {
      let getstate = getEmp(obj)
      dispatch(getstate)
       $('html, body').scrollTop(0)

    },
    onDeleteClick: (obj) => {
      dispatch(deleteEmp(obj))
    }
  }
}

const VisibleEmpList = connect(
  mapStateToProps,
  mapDispatchToProps
)(Emplist);

export default VisibleEmpList;