import React from 'react';

class Emp extends React.Component {
    
    render() {
        const { firstname, midname, surname, gender, birth, onClick, completed, id, text, onDeleteClick } = this.props
        return (
            // <li onClick={onClick}
            // <li
            //     style={{ cursor: 'pointer', textDecoration: completed ? 'line-through' : 'none' }}>
            //     {text}<button onClick={onDeleteClick}>X</button></li>
            <tr>
                <th scope="row">{id}</th>
                <td>{firstname}</td>
                <td>{midname}</td>
                <td>{surname}</td>
                <td>{gender}</td>
                <td>{birth}</td>
                <td><button className="btn btn-info" onClick={onClick}><span className="glyphicon glyphicon-pencil"></span></button></td>
                <td><button className="btn btn-danger" onClick={onDeleteClick}><span className="glyphicon glyphicon-remove"></span></button></td>
            </tr>
        );
    }
}



Emp.propTypes = {
    id: React.PropTypes.number.isRequired,
    onClick: React.PropTypes.func.isRequired,
    onDeleteClick: React.PropTypes.func.isRequired,
    firstname: React.PropTypes.string.isRequired,
    midname: React.PropTypes.string.isRequired,
    surname: React.PropTypes.string.isRequired,
    gender: React.PropTypes.string.isRequired,
    birth: React.PropTypes.string.isRequired
};

export default Emp;