import React from 'react'
import 'materialize-autocomplete'

import Spinner from '~/www/components/Spinner'
import DayTimesheetRow from './DayTimesheetRow'

import config from '~/www/config'
import projectsService from '~/www/services/projects'
import timesheetsService from '~/www/services/timesheets'
import timesheetTasksService from '~/www/services/timesheets-tasks'
import sharepointUtils from '~/www/services/util/sharepointUtils'

const MLS_IN_HOUR = 1e3 * 60 * 60;

export default class DayTimesheet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            rows: []
        };
    }

    componentWillMount() {
        this.loadTimesheetRows();
    }

    componentWillUnmount() {}

    loadTimesheetRows() {
        this.setState({isLoading: true});
        // Load timesheet items for specified Date
        var timesheetRows = [];
        timesheetsService.getTimesheetForDay(this.props.date, sharepointUtils.getUserId()).then(data => {
            var now = new Date();
            timesheetRows = data.map(x => {
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

            return timesheetRows;
        }).then((rows) => {
            // Load tasks
            return timesheetTasksService.getTasksForTimesheets(rows.map(x => x.id))
        }).then((tasks) => {
            // Assign tasks to timesheet rows
            timesheetRows.forEach(r => {
                r.tasks = tasks.filter(t => t.TimesheetId == r.id)
            })
        }).then(() => {
            this.setState({
                isLoading: false,
                rows: timesheetRows
            }, () => {
                this.initAutocomplete()
            });
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

    render() {
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
                            {!!this.state.rows.length && this.state.rows.map((row) => (<DayTimesheetRow key={row.id} row={row} date={this.props.date}/>))}
                        </div>
                    </div>
                )}

            </div>
        );

    }
};
