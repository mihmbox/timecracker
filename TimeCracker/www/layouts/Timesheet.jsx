import React from 'react';
import DayTimesheet from '~/www/components/Timesheet/DayTimesheet'
import 'materialize-css'

export default class Timesheet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: new Date()
        };
    }

    componentDidMount() {
        this.setupDatepicker();
    }

    setupDatepicker() {
        // cache this so we can reference it inside the datepicker
        var _this = this;
        // the element
        $(this.refs.changeDateBtn).pickadate({
            format: 'yyyy-mm-dd',
            formatSubmit: 'yyyy-mm-dd',
            selectMonths: true,
            selectYears: 5,
            closeOnSelect: true,
            onSet: function(e) {
                if (e.select) {
                    _this.setState({
                        date: new Date(e.select)
                    });
                    // auto close on select
                    this.close();
                }
            }
        });
    }
    disableClick(e) {
        e.preventDefault()
        return false;
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col s6">
                        <h4>Timesheet</h4>
                    </div>
                    <div className="col s6 right-align valign-wrapper timesheet_datewr">
                        <h5 className="timesheet__currentdate valign">{this.state.date.toDateString()}</h5>

                        <a className="btn-floating btn-large waves-effect waves-light red" ref="changeDateBtn" href="#" onClick={this.disableClick}>
                            <i className="material-icons">perm_contact_calendar</i>
                        </a>
                    </div>
                </div>

                <DayTimesheet key={this.state.date.getTime()} date={this.state.date}/>
            </div>
        );
    }
}
