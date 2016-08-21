import React from 'react'
import 'materialize-autocomplete'

import Spinner from '~/www/components/Spinner'
import timesheetsService from '~/www/services/timesheets'
import timesheetTasksService from '~/www/services/timesheets-tasks'

const MLS_IN_HOUR = 1e3 * 60 * 60;
const updateHoursTimeout = 500;

export default class DayTimesheetRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            ...this.props.row,
        };
    }

    componentDidMount() {
        this.initHoursTimer();
    }

    componentWillUnmount() {
        clearInterval(this.hoursTimer);
    }

    initHoursTimer() {
        clearInterval(this.hoursTimer)
        this.hoursTimer = setInterval(() => {
            if (this.state.isRunning) {
                var hours = this.state.hours + updateHoursTimeout / MLS_IN_HOUR;
                this.setState({hours: hours});
            }
        }, updateHoursTimeout);
    }

    // initAutocomplete() {
    //     var _this = this;
    //     var autocomplete = $(this.refs.projectNameInp).materialize_autocomplete({
    //         dropdown: {
    //             el: '#projectsDropdown',
    //             noItem: 'No data'
    //         },
    //         multiple: {
    //             enable: true,
    //             maxSize: 1,
    //             onAppend: function(item) {
    //                 autocomplete.remove(item);
    //                 _this.addTimesheetRow(item);
    //             }
    //         },
    //         limit: 10,
    //         cacheable: true,
    //         getData: function(value, callback) {
    //             projectsService.searchProject(value).then((projects) => {
    //                 var data = projects.map((p) => {
    //                     return {id: p.Id, text: p.Title}
    //                 });
    //                 callback(value, data); // data [array]: Data array，should be formatted as [{ 'id': '1', 'text': 'a' }, { 'id': '2', 'text': 'b'}]
    //             });
    //         }
    //     });
    // }

    toggleTimer(timesheetId, start) {
        var now = new Date();
        var promise = start
            ? timesheetsService.startTimer(timesheetId, now)
            : timesheetsService.stopTimer(timesheetId, now);

        promise.then(item => {
            // Set new state
            this.setState({isRunning: start, hours: item.Hours});
        });
    }

    handleTaskKeyPress(e) {
        var val = (e.target.value || '').trim();
        if (e.key == 'Enter' && val) {
            e.target.value = "";

            timesheetTasksService.create({title: val, timesheetId: this.state.id}).then((item) => {
                var tasks = [
                    ...this.state.tasks,
                    item
                ];

                this.setState({tasks: tasks});
            });
        }
    }

    render() {
        var btnClass = (isRunning) => 'btn-floating btn-large waves-effect waves-light red right' + (isRunning
            ? ''
            : ' lllllighten-3 ');

        return (
            <div className={this.state.isRunning
                ? 'collection-item'
                : ' collection-item'} data-id={this.state.project.id}>
                <div className={this.state.isRunning
                    ? 'row teal lighten-2 white-text'
                    : ' row'}>
                    <div className="col s10">
                        <h5 className="timesheet__project-name">
                            {this.state.project.title}
                        </h5>
                    </div>
                    <div className="col s1 timesheet__hours-col">
                        <span className="right timesheet__hours">
                            {Math.round(this.state.hours * 1e2) / 1e2}
                        </span>

                        {this.state.isRunning && <Spinner big={true}/>}

                    </div>
                    <div className="col s1">
                        <a className={btnClass(this.state.isRunning)} onClick={() => this.toggleTimer(this.state.id, !this.state.isRunning)}>
                            <i className="material-icons">{this.state.isRunning
                                    ? 'pause'
                                    : 'play_arrow'}</i>
                        </a>
                    </div>
                </div>

                <div className="timesheet__tasks-wr">

                    {!!this.state.tasks.length && this.state.tasks.map((task) => (
                        <div className="chip">{task.Title}
                            <i className="material-icons close">close</i>
                        </div>
                    ))}

                    <input type="text" ref={'taskAutocomplete-' + this.state.id} onKeyPress={(e) => this.handleTaskKeyPress(e)} placeholder="What are you working on right now?" data-activates="projectsDropdown" data-beloworigin="true" autocomplete="off"/>
                </div>
            </div>
        )
    }
}
