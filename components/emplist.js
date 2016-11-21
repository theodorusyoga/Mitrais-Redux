import React from 'react';
import Emp from './emp';
import request from 'superagent'

class Emplist extends React.Component {
    componentWillMount() {
        const { dispatch } = this.props
        request
            .get('http://localhost:5000/api')
            .end((err, res) => {
                if (err) {
                    return;
                }
                const data = JSON.parse(res.text);

                dispatch({ type: 'GET_EMPLOYEES', emps: data })
         
                data.map(item => {
                    if (item.gender == 'Male')
                        dispatch({ type: 'ADD_MALE', counter: 'ADD_MALE' })
                    else
                        dispatch({ type: 'ADD_FEMALE', counter: 'ADD_MALE' })
                })

            })
    }
    render() {
        const { emps, onEmpClick, onDeleteClick } = this.props

        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Middle Name</th>
                        <th>Last Name</th>
                        <th>Gender</th>
                        <th>Date of Birth</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {emps.map(emp =>
                        <Emp id={emp.id} key={emp.id} firstname={emp.firstname}
                            surname={emp.surname} midname={emp.midname}
                            gender={emp.gender} birth={emp.birth}
                            onClick={() => onEmpClick(emp)}
                            onDeleteClick={() => onDeleteClick(emp)} />
                    )}
                </tbody>
            </table>

        );
    }
}

Emplist.propTypes = {
    emps: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        firstname: React.PropTypes.string.isRequired,
        midname: React.PropTypes.string.isRequired,
        surname: React.PropTypes.string.isRequired,
        gender: React.PropTypes.string.isRequired,
        birth: React.PropTypes.string.isRequired
    }).isRequired).isRequired,
    onEmpClick: React.PropTypes.func.isRequired,
    onDeleteClick: React.PropTypes.func.isRequired,
    dispatch: React.PropTypes.func.isRequired
};

export default Emplist;
