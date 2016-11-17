import { connect } from 'react-redux';
import  Dailyusers  from '../components/dailyusers';

const mapStateToProps = (state) => {
    return {
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

const DailyPanel = connect(mapStateToProps, mapDispatchToProps)(Dailyusers);

export default DailyPanel;