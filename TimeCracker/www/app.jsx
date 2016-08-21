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
