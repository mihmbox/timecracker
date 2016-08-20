// import './projects.css';
import React from 'react';
import ProjectsList from '~/www/components/Projects/ProjectsList.jsx';

export default class Projects extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="projects-layout">
                <h4>Projects</h4>
                <ProjectsList pageSize="2"/>
            </div>
        );
    }
}
