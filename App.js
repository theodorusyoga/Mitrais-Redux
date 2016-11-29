import React from 'react';
import ReactDOM from 'react-dom';
import { combineReducers, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import { IndexRoute, Router, Route, Link, hashHistory, browserHistory } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { syncHistoryWithStore, analyticsService } from 'react-router-redux'
import request from 'superagent'
import InstaList from './containers/instaList'
import InstaPanel from './containers/instaPanel'
import Validate from './containers/validate'
import  reducers  from './reducers'

const enhancers = compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
)

const store = createStore(reducers, enhancers);
const history = syncHistoryWithStore(hashHistory, store)

export class App extends React.Component {
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

export default App