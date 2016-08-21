import config from '~/www/config'
import spListUtils from './util/sharepointUtils'

const MLS_IN_HOUR = 1e3 * 60 * 60;
const list = config.Lists.Timesheets;

var calculateTotalHours = function(item, now) {
    var isRunning = item.State == list.States.Running;
    var hours = item.Hours;

    if (isRunning) {
        var startDate = new Date(item.Start);
        if (startDate.getTime() == startDate.getTime()) { // check if date is valid
            hours += (now - startDate) / MLS_IN_HOUR;
        }
    }

    return hours;
}

var getTimesheetForDay = function(date, userId, projectId) {
    var fields = list.fields;
    var dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    var filter = `(${fields.Author} eq ${userId})
                    and (${fields.Date} ge datetime'${dateString}T00:00:00.000Z')
                    and (${fields.Date} le datetime'${dateString}T23:59:59.000Z')`;
    if (projectId) {
        filter += ` and (${fields.Project} eq '${projectId}')`;
    }

    var extraQuery = `$expand=${fields.Project}&$select=Id,${fields.Title},${fields.State},${fields.Start},${fields.Hours},${fields.Project}/Id,${fields.Project}/Title&$orderby=Modified desc`;

    return spListUtils.findListItem(list.name, filter, extraQuery).then(function(data) {
        return data.results;
    });
}

/*
 add empty timesheet row
 data = {projectId, startDate}
 */
var createTimesheet = function(data) {
    return getTimesheetForDay(data.startDate, spListUtils.getUserId(), data.projectId).then(function(items) {
        if (items && items.length) {
            return items[0];
        }

        var obj = {};
        obj[list.fields.Title] = data.startDate.toDateString() + '-' + data.projectTitle;
        obj[list.fields.Start] = data.startDate;
        obj[list.fields.Date] = data.startDate;
        obj[list.fields.Project + 'Id'] = data.projectId;
        obj[list.fields.Hours] = data.hours;
        obj[list.fields.Description] = data.description || '';
        obj[list.fields.Parent + 'Id'] = data.parentId || '';

        return spListUtils.createListItem(list.name, obj).then(function(data) {
            return data;
        });
    });
}

var startTimer = function(timesheetId, now) {
    var props = {};
    props[list.fields.Start] = now;
    props[list.fields.State] = list.States.Running;
    return spListUtils.updateListItem(list.name, timesheetId, props)
        .then(() => spListUtils.getById(list.name, timesheetId));
}

var stopTimer = function(timesheetId, now) {
    return spListUtils.getById(list.name, timesheetId).then(function(item) {
        if (!item) return null;

        var props = {};
        props[list.fields.State] = list.States.Stopped;
        props[list.fields.Hours] = calculateTotalHours(item, now);

        return spListUtils.updateListItem(list.name, timesheetId, props).then(function() {
            return {...item,
                ...props
            };
        });
    });
}

export default {
    calculateTotalHours,
    createTimesheet,
    getTimesheetForDay,
    startTimer,
    stopTimer
}
