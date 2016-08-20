import React from 'react'
import ProjectsSyncAction from './ProjectsSyncAction'

export default class ProjectsToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
    }

    render() {
        return (
            <div className="projects-list-toolbar">
                <ProjectsSyncAction />
            </div>
        )
    }
};
