import React from 'react';
import ProjectRow from './project-row.jsx'; // Our custom react component


class ProjectsList extends React.Component {
    render() {
        return (

            <div className="test">
                Hello, world! I am a ProjectsList.
                <ProjectRow/>
                <ProjectRow/>
                <ProjectRow/>
                <ProjectRow/>
                <ProjectRow/>
                <ProjectRow/>
                <ProjectRow/>
                The end
            </div>

        );
    }
}

export default ProjectsList;

/*

*/
