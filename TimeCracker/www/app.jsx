// Materizlize assets
import 'materialize-css/bin/materialize.css'

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, IndexRoute, browserHistory} from 'react-router'

import {MainLayout, Projects, Timesheet, NoMatch} from './layouts'
import './main.css'

// Declarative route configuration (could also load this config lazily
// instead, all you really need is a single root route, you don't need to
// colocate the entire config).
//history={browserHistory}
render((
    <Router >
        <Route path="/" component={MainLayout}>
            <IndexRoute component={Timesheet}/>
            <Route path="timesheet" component={Timesheet}/>
            <Route path="projects" component={Projects}>
                {/*<Route path="/projects/:projectId" component={Project}/>*/}
            </Route>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>
), document.getElementById('app'))

//
//
//
// import Materialize from './components/materialize.jsx';
//
// // materialize
// render(<Materialize />, document.getElementById('app'));
//

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
//
// ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");
//
// function initializePage() {
//     var context = SP.ClientContext.get_current();
//     var user = context.get_web().get_currentUser();
//
//     // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
//     $(document).ready(function() {
//         getUserName();
//     });
//
//     // This function prepares, loads, and then executes a SharePoint query to get the current users information
//     function getUserName() {
//         context.load(user);
//         context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
//     }
//
//     // This function is executed if the above call is successful
//     // It replaces the contents of the 'message' element with the user name
//     function onGetUserNameSuccess() {
//         $('#message').text('Hello ' + user.get_title());
//     }
//
//     // This function is executed if the above call fails
//     function onGetUserNameFail(sender, args) {
//         alert('Failed to get user name. Error:' + args.get_message());
//     }
// }
