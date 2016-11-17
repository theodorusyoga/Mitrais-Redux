import { connect } from 'react-redux';
import  Empcounter  from '../components/empcounter';

const getCounter = (counter) =>{
  return counter;
}

const mapStateToProps = (state) => {
  return {
      total: state.empcounter.total,
      totalMale: state.empcounter.totalMale,
      totalFemale: state.empcounter.totalFemale
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    
  }
}

const EmpCounterDisp = connect(
  mapStateToProps,
  mapDispatchToProps
)(Empcounter);


export default EmpCounterDisp;