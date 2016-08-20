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
                                    <Link to='/' activeClassName="active">Timesheet</Link>
                                </li>
                                <li>
                                    <Link to='/projects' activeClassName="active">Projects</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>

                <main>
                    {this.props.children}
                </main>

                <footer className="page-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col l6 s12">
                                <h5 className="white-text">Footer Content</h5>
                                <p className="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
                            </div>
                            <div className="col l4 offset-l2 s12">
                                <h5 className="white-text">Links</h5>
                                <ul>
                                    <li>
                                        <a className="grey-text text-lighten-3" href="#!">Link 1</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
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
