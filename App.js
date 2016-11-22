import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import empreducer from './reducers';
import AddEmp from './containers/AddEmp';
import VisibleEmpList from './containers/empList';
import EmpCounterDisp from './containers/empCounterDisp';
import PanelTodo from './containers/panelTodo';
import DailyPanel from './containers/dailyPanel';
import { IndexRoute, Router, Route, Link, hashHistory, browserHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ES6 from './components/es6';
import InstaList from './containers/instaList'
import InstaPanel from './containers/instaPanel'
import Validate from './containers/validate'
import { syncHistoryWithStore, analyticsService } from 'react-router-redux'
import request from 'superagent'

const store = createStore(empreducer);
const history = syncHistoryWithStore(browserHistory, store)


// export class ES6Panel extends React.Component {
//     render() {
//         return (
//             <ES6 />
//         )
//     }
// }

// export class Toptiles extends React.Component {
//     render() {
//         return (
//             <div>
//                 <Provider store={store}>
//                     <div>
//                         <EmpCounterDisp /></div>
//                 </Provider>

//             </div>
//         );
//     }
// }

// export class Xpanel extends React.Component {
//     render() {
//         const { children, location } = this.props
//         return (

//             <div>
//                 <Link to="/" className="btn btn-router btn-info">To Do List</Link>
//                 <Link to="/daily" className="btn btn-router btn-info">Daily Active Users</Link>
//                 <ReactCSSTransitionGroup transitionName="todo"
//                     transitionAppear={true}
//                     transitionEnterTimeout={500}
//                     transitionLeaveTimeout={500}
//                     transitionAppearTimeout={500}
//                     >
//                     {React.cloneElement(children, {
//                         key: location.pathname
//                     })}
//                 </ReactCSSTransitionGroup>

//             </div >
//         )
//     }
// }


// export class Daily extends React.Component {
//     render() {
//         return (
//             <Provider store={store}>
//                 <div>
//                     <DailyPanel /></div>
//             </Provider>
//         )
//     }
// }

// export class Panel extends React.Component {
//     render() {
//         return (
//             <Provider store={store}>
//                 <div>
//                     <PanelTodo /></div>
//             </Provider>
//         )
//     }
// }

export class InstaIndex extends React.Component {
    render() {
        return (
            <div>
                <Provider store={store}>
                    <Router history={history}>
                        <Route path="/" component={InstaRoot}>
                            <IndexRoute component={Validate} />
                            <Route path="/home" component={Insta}/>
                            <Route path="/view" component={InstaDetails} />
                        </Route>
                    </Router>
                </Provider>
            </div>
        )
    }
}

export class InstaRoot extends React.Component {
    render() {
        const { children, location } = this.props
        return (
            <div>
                <div className="x_title">
                    <h2>Mini Instagram<small>Gallery</small></h2>
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
                {React.cloneElement(children, {
                    key: location.pathname
                })}
            </div>

        )
    }
}

export class Insta extends React.Component {
    render() {
        return (

            <div>
                <InstaList />

            </div>

        )
    }
}

export class InstaDetails extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <div>
                    <InstaPanel />
                </div>
            </Provider>
        )
    }
}

// class App extends React.Component {
//     render() {
//         return (
//             <div>
//                 <Provider store={store}>
//                     <div>
//                         <AddEmp />
//                         <VisibleEmpList />
//                     </div>
//                 </Provider>
//             </div>
//         )

//     }
// }

export default InstaIndex