import React from 'react'
import 'materialize-autocomplete'

import Spinner from '~/www/components/Spinner'

import config from '~/www/config'
import projectsService from '~/www/services/projects'
import timesheetsService from '~/www/services/timesheets'
import sharepointUtils from '~/www/services/util/sharepointUtils'

const MLS_IN_HOUR = 1e3 * 60 * 60;

export default class DayTimesheet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            rows: [],
            updateHoursTimeout: 500
        };
    }

    componentWillMount() {
        this.loadTimesheetRows();
    }

    componentWillUnmount() {
        clearInterval(this.hoursTimer);
    }

    loadTimesheetRows() {
        this.setState({isLoading: true});
        // Load timesheet items for specified Date
        timesheetsService.getTimesheetForDay(this.props.date, sharepointUtils.getUserId()).then(data => {
            var now = new Date();
            var timesheetRows = data.map(x => {
                var hours = timesheetsService.calculateTotalHours(x, now);
                var isRunning = x.State == config.Lists.Timesheets.States.Running;

                return {
                    id: x.Id,
                    project: {
                        id: x.Project.Id,
                        title: x.Project.Title
                    },
                    isRunning: isRunning,
                    hours: hours
                }
            });

            this.setState({
                isLoading: false,
                rows: timesheetRows
            }, () => {
                this.initAutocomplete()
            });

            clearInterval(this.hoursTimer)
            this.hoursTimer = setInterval(() => {
                var newRows = [...this.state.rows];
                newRows.filter(r => r.isRunning).forEach(row => {
                    row.hours += this.state.updateHoursTimeout / MLS_IN_HOUR;
                });
                this.setState({rows: newRows});
            }, this.state.updateHoursTimeout);
        });
    }

    initAutocomplete() {
        var _this = this;
        var autocomplete = $(this.refs.projectNameInp).materialize_autocomplete({
            dropdown: {
                el: '#projectsDropdown',
                noItem: 'No data'
            },
            multiple: {
                enable: true,
                maxSize: 1,
                onAppend: function(item) {
                    autocomplete.remove(item);
                    _this.addTimesheetRow(item);
                }
            },
            limit: 10,
            cacheable: true,
            getData: function(value, callback) {
                projectsService.searchProject(value).then((projects) => {
                    var data = projects.map((p) => {
                        return {id: p.Id, text: p.Title}
                    });
                    callback(value, data); // data [array]: Data array，should be formatted as [{ 'id': '1', 'text': 'a' }, { 'id': '2', 'text': 'b'}]
                });
            }
        });
    }

    addTimesheetRow(project) {
        // create item in list and update state
        timesheetsService.createTimesheet({projectId: project.id, projectTitle: project.text, startDate: this.props.date}).then((item) => {
            var alreadyExist = this.state.rows.filter(r => r.id == item.Id).length > 0;
            if (!alreadyExist) {
                var newRow = {
                    id: item.Id,
                    project: {
                        id: project.id,
                        title: project.text
                    },
                    isRunning: false,
                    hours: 0
                };
                this.setState({
                    rows: [
                        newRow, ...this.state.rows
                    ]
                });
            }
        });
    }

    toggleTimer(timesheetId, start) {
        var now = new Date();
        this.state.rows.filter(r => r.id == timesheetId).forEach(row => {
            var promise = start
                ? timesheetsService.startTimer(timesheetId, now)
                : timesheetsService.stopTimer(timesheetId, now);

            promise.then(item => {
                // Set new state
                var newRows = [...this.state.rows];
                newRows.filter(r => r.id == timesheetId).forEach(row => {
                    row.isRunning = start
                    row.hours = item.Hours || 0;
                });
                this.setState({rows: newRows});
            });
        });
    }

    render() {
        var btnClass = (isRunning) => 'btn-floating btn-large waves-effect waves-light red right' + (isRunning
            ? ''
            : ' lllllighten-3 ');

        return (
            <div>
                {this.state.isLoading && <Spinner/>}

                {!this.state.isLoading && (
                    <div>
                        <div className="input-field">
                            <i className="material-icons prefix">add</i>
                            <input type="text" ref="projectNameInp" placeholder="Report time for project" data-activates="projectsDropdown" data-beloworigin="true" autocomplete="off"/>
                            <ul id="projectsDropdown" className="dropdown-content ac-dropdown"></ul>
                        </div>

                        <div className="collection timesheets-collection">
                            {!!this.state.rows.length && this.state.rows.map((row) => (
                                <div className={row.isRunning
                                    ? 'collection-item'
                                    : ' collection-item'} data-id={row.project.id}>
                                    <div className={row.isRunning
                                        ? 'row teal lighten-2 white-text'
                                        : ' row'}>
                                        <div className="col s10">
                                            <h5 className="timesheet__project-name">
                                                {row.project.title}
                                            </h5>
                                        </div>
                                        <div className="col s1 timesheet__hours-col">
                                            <span className="right timesheet__hours">
                                                {Math.round(row.hours * 1e2) / 1e2}
                                            </span>

                                            {row.isRunning && <Spinner big={true}/>}

                                        </div>
                                        <div className="col s1">
                                            <a className={btnClass(row.isRunning)} onClick={() => this.toggleTimer(row.id, !row.isRunning)}>
                                                <i className="material-icons">{row.isRunning
                                                        ? 'pause'
                                                        : 'play_arrow'}</i>
                                            </a>
                                        </div>
                                    </div>

                                    <div className="timesheet__tasks-wr">
                                        <input type="text" ref={'taskAutocomplete-' + row.id} placeholder="What are you working on right now?" data-activates="projectsDropdown" data-beloworigin="true" autocomplete="off"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        );

    }
};
