import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { ES6Panel, Xpanel, Toptiles, Daily, Panel, InstaIndex } from './App.js';
import { IndexRoute, Router, Route, Link, hashHistory, browserHistory } from 'react-router';


// ReactDOM.render( <App/>, document.getElementById('app'));
// ReactDOM.render(<Toptiles />, document.getElementById('toptiles'));
// ReactDOM.render(
//     <div>
//         <Router history={hashHistory}>
//             <Route path="/" component={Xpanel}>
//                 <IndexRoute component={Panel} />
//                 <Route path="/daily" component={Daily} />
//             </Route>

//         </Router>
//     </div>, document.getElementById('todopanel')
// )
// ReactDOM.render(
//     <div>
//         <ES6Panel/>
//     </div>, document.getElementById('es6panel')
// )

ReactDOM.render(
    <div>
        <InstaIndex/>
    </div>, document.getElementById('insta')
)