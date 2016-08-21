// import './projects.css';
import React from 'react';
import ProjectsList from '~/www/components/Projects/ProjectsList.jsx';

export default class Projects extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: new Date()
        };
    }
    render() {

        return (
            <div className="projects-layout">
                <h4>Projects</h4>
                <ProjectsList pageSize="20"/>
            </div>
        );
    }
}
