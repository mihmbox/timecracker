import axios from 'axios'
import config from '~/www/config'

var baseUrl = config.API.TenFeet_URL,
    token = config.API.TenFeet_TOKEN

var getProjects = function(perPage=100, onlyFirstPage = false) {
    var url = `${baseUrl}/api/v1/projects?per_page=${perPage}&auth=${token}`;
    return loadProjects([], url, onlyFirstPage);
};

var loadProjects = function(result, url, onlyFirstPage) {
    return axios.get(url).then(function(response) {
        result = result.concat(response.data.data);

        var next = response.data.paging.next;
        if (next && !onlyFirstPage) {
            var nextUrl = `${baseUrl}${next}&auth=${token}`;
            return loadProjects(result, nextUrl);
        } else {
            return result;
        }
    });
};



export default {
    getProjects
}
