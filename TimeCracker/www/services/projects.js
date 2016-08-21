import config from '~/www/config'
import spListUtils from './util/sharepointUtils'

var list = config.Lists.Projects;


// get list of all projects
var getAll = function() {
    return spListUtils.findListItem(list.name).then(function(data) {
        return data.results;
    });
}

// Find project by specified string
var searchProject = function(key) {
    return spListUtils.findListItem(list.name, `substringof('${key}', ${list.fields.Title})`).then(function(data) {
        return data.results;
    });
}

export default {
    getAll,
    searchProject
}
