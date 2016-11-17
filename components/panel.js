import React from 'react';
import request from 'superagent';
import { addTodo } from '../actions';

export let test = 'This is an exported variable';

class Panel extends React.Component {
    
    componentDidMount() {
        const { dispatch, todos } = this.props
        NProgress.start();
        request
            .get('http://localhost:5000/todo')
            .end((err, res) => {
                if (err) {
                    return;
                }
                const data = JSON.parse(res.text);
                dispatch({type: 'CLEAR_TODO'});
                data.map(item => {
                    let obj = addTodo(item)
                    dispatch(obj);
                })
                NProgress.done();
            })
    }
    render() {
        const { todos } = this.props
        return (

            <div className="x_panel">
                <div className="x_title">
                    <h2>To Do List <small>Sample tasks</small></h2>
                  
                    <ul className="nav navbar-right panel_toolbox">
                        <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                        </li>
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
                            <ul className="dropdown-menu" role="menu">
                                <li><a href="#">Settings 1</a>
                                </li>
                                <li><a href="#">Settings 2</a>
                                </li>
                            </ul>
                        </li>
                        <li><a className="close-link"><i className="fa fa-close"></i></a>
                        </li>
                    </ul>
                    <div className="clearfix"></div>
                </div>
                <div className="x_content">
                    <p className="alert alert-warning"><span className="glyphicon glyphicon-warning-sign"></span> To Do List is fetched from database</p>
                    <div className="">
                        <ul className="to_do">
                            {todos.map(todo => 
                                <li key={todo.id}>
                                    <p><input type="checkbox" className="flat" />{todo.text}</p>
                                </li>
                            )}



                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

Panel.propTypes = {
    todos: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        text: React.PropTypes.string.isRequired
    }).isRequired).isRequired,
}

export default Panel