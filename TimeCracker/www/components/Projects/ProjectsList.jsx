import React from 'react'
import ProjectsToolbar from './ProjectsToolbar'
import Spinner from '~/www/components/Spinner'
import ProjectsService  from '~/www/services/projects.js'

export default class ProjectsList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isFailed: false,
            projects: [],
            activePage: 0,
            pagesCount: 0,
            pageSize: +props.pageSize || 10
        };
    }

    componentWillMount() {
        ProjectsService.getAll().then((projects) => {
            this.setState({
                isLoading: false,
                projects: projects,
                pagesCount: Math.ceil(projects.length / this.state.pageSize)
            });
        }).catch(function() {
            alert('Fail');
        });
    }

    // Load projects page by click
    loadProjectsPage(pageNumber, ev) {
        this.setState({
            activePage: pageNumber
        });
        ev.preventDefault();
        return false;
    }

    render() {
        var page = this.state.activePage;
        var startIdx = page * this.state.pageSize;
        var pageProjects = this.state.projects.slice(startIdx, startIdx + this.state.pageSize);
        var tableBlock = (
            <div>
                <table className="striped highlight">
                    <thead>
                        <tr>
                            <th data-field="code">Code</th>
                            <th data-field="name">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageProjects.map((row) => (
                            <tr>
                                <td>{row.TenFtId}</td>
                                <td>{row.Title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <ul className="pagination">
                    {/*
                    <li className="disabled">
                        <a href="#!">
                            <i className="material-icons">chevron_left</i>
                        </a>
                    </li>
                    */}
                    {Array(this.state.pagesCount).fill().map((v, i) => (
                        <li className={(this.state.activePage == i)
                            ? "active"
                            : ""}>
                            <a href="#" onClick={(e) => this.loadProjectsPage(i, e)}>{i + 1}</a>
                        </li>
                    ))}

                    {/*
                    <li className="waves-effect">
                        <a href="#!">
                            <i className="material-icons">chevron_right</i>
                        </a>
                    </li>
                    */}
                </ul>
            </div>
        );

        return (
            <div>
                <ProjectsToolbar />
                <div className="projects-list center-align">
                    {this.state.isLoading && <Spinner />}
                    {!this.state.isLoading && tableBlock}
                </div>
            </div>
        )
    }
};
