import React from 'react'

import TenFeetApi from '~/www/services/10kfeet-api.js'
import ProjectsImport from '~/www/services/sp-projects-import.js'

export default class ProjectsSyncAction extends React.Component {
    constructor(props) {
        super(props);

        this.initialState = {
            stage: '', // LOADING_PROJECTS, IMPORTING_PROJECTS
            processed: 0,
            progress: 0,
            projects: [],
            messages: []
        };

        this.state = {
            ...this.state
        };
    }

    componentDidMount() {
        // this.showModal()
    }

    showModal(e) {
        this.setState(this.initialState);

        jQuery(this.refs.syncProjectsModal).openModal();
        e && e.preventDefault()
    }

    closeModal() {
        jQuery(this.refs.syncProjectsModal).closeModal();
    }

    addMessage(msg) {
        this.setState({
            messages: this.state.messages.concat(msg)
        }, () => {
            this.refs.messagesList.scrollTop = this.refs.messagesList.scrollHeight;
        });
    }

    startSynchronization() {
        this.setState({stage: 'LOADING_PROJECTS'});

        // TODO test for first Five
        //TenFeetApi.getProjects(5, true).then((projects) => {
        TenFeetApi.getProjects(100, false).then((projects) => {
            var count = projects.length;
            this.addMessage(`Loaded ${count} projects from 10000ft.`);
            this.setState({stage: 'IMPORTING_PROJECTS', projects: projects});
        }).then(() => {
            ProjectsImport.importProjectsFrom10KFt(this.state.projects, {
                itemProcessed: (project) => {
                    var processed = this.state.processed + 1;
                    var progress = Math.round(processed / this.state.projects.length * 100);
                    this.setState({processed: processed, progress: progress});
                },
                beforeImport: (project) => {
                    this.addMessage(`Trying to import "${project.name.trim()}"`)
                },
                imported: (project, isCreated) => {
                    this.addMessage(isCreated
                        ? `Created "${project.name.trim()}"`
                        : `Updated "${project.name.trim()}"`)
                },
                error: (project, err) => {
                    this.addMessage(`Error occured for "${project.name.trim()}": ${err}`)
                }
            });
        }).catch(function() {
            alert('Fail');
        });
    }

    render() {
        return (
            <div className="">
                <a ref="modalTrigger" className="waves-effect waves-light btn modal-trigger" onClick={(ev) => this.showModal(ev)} href="syncProjectsModal">
                    <i className="material-icons left">loop</i>Sync projects with 10000ft
                </a>

                <div ref="syncProjectsModal" id="syncProjectsModal" className="modal">
                    <div className="modal-content">
                        <h4>10000ft Projects synchronization</h4>
                        <p>
                            {this.state.stage == ''
                                ? (
                                    <button className="btn waves-effect waves-light" type="button" onClick={() => this.startSynchronization()}>
                                        Start
                                    </button>
                                )
                                : ''}
                            {this.state.stage == 'LOADING_PROJECTS'
                                ? (
                                    <div>
                                        <h5>1. Loading projects list</h5>
                                        <div className="progress">
                                            <div className="indeterminate"></div>
                                        </div>
                                    </div>
                                )
                                : ''}

                            {this.state.stage == 'IMPORTING_PROJECTS'
                                ? (
                                    <div>
                                        <h5>2. Importing projects &nbsp;
                                            {this.state.progress + '%'}</h5>
                                        <div className="progress">
                                            <div className="determinate" style={{
                                                width: this.state.progress + '%'
                                            }}></div>
                                        </div>
                                    </div>
                                )
                                : ''}

                            {this.state.messages && this.state.messages.length
                                ? (
                                    <ul className="collection with-header sync-messages-queue" ref="messagesList">
                                        {this.state.messages.map((m) => (
                                            <li className="collection-item">{m}</li>
                                        ))}
                                    </ul>
                                )
                                : ''}
                        </p>
                    </div>
                    <div className="modal-footer">
                        <a className=" modal-action modal-close waves-effect waves-green btn-flat" onClick={() => this.closeModal()}>Close</a>
                    </div>
                </div>
            </div>
        )
    }
};
