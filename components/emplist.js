import React from 'react';
import Emp from './emp';

class Emplist extends React.Component {
    
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
                            onClick={() =>  onEmpClick(emp)}
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
    onDeleteClick: React.PropTypes.func.isRequired
};

export default Emplist;
