import './topnav.css';

// var imgUrl = require('file!./wwwui-icons_444444_256x240.png');

import React from 'react';
import ProjectList from './projects-list.jsx';

//import cssFile from 'topnav.css';

export default class MaterializeExample  extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <img id='test-image' src={require('./mik-ui-icons_444444_256x240.png')} />
                <a className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">add</i></a>
                <nav>
                    <div className="nav-wrapper">
                      <a href="#" className="brand-logo right">Logo</a>
                      <ul id="nav-mobile" className="left hide-on-med-and-down">
                        <li><a href="sass.html">Sass</a></li>
                        <li><a href="badges.html">Components</a></li>
                        <li><a href="collapsible.html">JavaScript</a></li>
                      </ul>
                    </div>
                  </nav>

                  <ProjectList />

              </div>
        );
    }
}
