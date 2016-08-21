import React from 'react';
import {Link} from 'react-router'

export default class MainLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app">
                <header>
                    <nav>
                        <div className="nav-wrapper">
                            {/* <a href="#" className="brand-logo right">Logo</a> */}
                            <ul id="nav-mobile" className="left hide-on-med-and-down">
                                <li>
                                    <Link to='/timesheet' activeClassName="active">Timesheet</Link>
                                </li>
                                <li>
                                    <Link to='/projects' activeClassName="active">Projects</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>

                <main>
                    <div >
                        {this.props.children}
                    </div>
                </main>

                <footer className="page-footer">
                    <div className="footer-copyright">
                        <div className="container">
                            © 2014 Copyright Text
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
}
