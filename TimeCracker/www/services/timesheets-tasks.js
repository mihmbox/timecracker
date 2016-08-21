import config from '~/www/config'
import spListUtils from './util/sharepointUtils'

const list = config.Lists.TimesheetTasks;

/*
 add empty timesheet row
 data = {title, timesheetId}
 */
var create = function(data) {
    var obj = {};
    obj[list.fields.Title] = data.title;
    obj[list.fields.Timesheet + 'Id'] = data.timesheetId;

    return spListUtils.createListItem(list.name, obj).then(function(data) {
        return data;
    });
}

var getTasksForTimesheets = function(timesheetIds) {
    var filter = timesheetIds.map(id => `${list.fields.Timesheet}Id eq '${id}'`).join(' or ');
    //var extraQuery = `$expand=${fields.Project}&$select=Id,${fields.Title},${fields.State},${fields.Start},${fields.Hours},${fields.Project}/Id,${fields.Project}/Title&$orderby=Modified desc`;

    return spListUtils.findListItem(list.name, filter).then(function(data) {
        return data.results;
    });
}

export default {
    create,
    getTasksForTimesheets
}
