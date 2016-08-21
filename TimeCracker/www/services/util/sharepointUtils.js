import axios from 'axios'
import queryString from 'query-string';
import config from '~/www/config'

const parsedQS = queryString.parse(location.search)
var hostWebUrl = parsedQS.SPHostUrl;
var appWebUrl = parsedQS.SPAppWebUrl;

function getRequestDigest() {
    return document.getElementById('__REQUESTDIGEST').value;
}
// Get List Item Type metadata
function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
}

function getUserId() {
    return _spPageContextInfo.userId;
}

var loadRequestExecutor = function() {
    return new Promise((resolve, reject) => {
        ExecuteOrDelayUntilScriptLoaded(function() {
            if (typeof SP.RequestExecutor == 'undefined') {
                $.getScript(`${hostWebUrl}/_layouts/15/SP.RequestExecutor.js`).then(function() {
                    resolve(new SP.RequestExecutor(appWebUrl))
                }).fail(reject);
            } else {
                resolve(new SP.RequestExecutor(appWebUrl))
            }
        }, "sp.js");
    });
}

var findListItem = function(listName, filter, extraQuery) {
    filter = filter || '';
    extraQuery= extraQuery || '';

    return new Promise((resolve, reject) => {
        loadRequestExecutor().then((executor) => {
            executor.executeAsync({
                url: `${appWebUrl}/_api/SP.AppContextSite(@target)/web/lists/getbytitle('${listName}')/items?@target='${hostWebUrl}'&$filter=${filter}&${extraQuery}`,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function(data) {
                    resolve(JSON.parse(data.body).d);
                },
                error: function() {
                    reject(...arguments);
                }
            })
        });
    });
}

var getById = function(listName, itemId, viewFields) {
    viewFields = viewFields || '';

    return new Promise((resolve, reject) => {
        loadRequestExecutor().then((executor) => {
            executor.executeAsync({
                url: `${appWebUrl}/_api/SP.AppContextSite(@target)/web/lists/getbytitle('${listName}')/items(${itemId})?@target='${hostWebUrl}'&$select=${viewFields}`,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function(data) {
                    resolve(JSON.parse(data.body).d);
                },
                error: function() {
                    reject(...arguments);
                }
            })
        });
    });
}

var createListItem = function(listName, object) {
    return new Promise((resolve, reject) => {
        loadRequestExecutor().then((executor) => {
            var itemType = GetItemTypeForListName(listName);
            var item = {
                "__metadata": {
                    "type": itemType
                },
                ...object
            };

            executor.executeAsync({
                url: `${appWebUrl}/_api/SP.AppContextSite(@target)/web/lists/getbytitle('${listName}')/items?@target='${hostWebUrl}'`,
                method: "POST",
                body: JSON.stringify(item),
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": getRequestDigest()
                },
                success: function(data) {
                    resolve(JSON.parse(data.body).d);
                },
                error: function() {
                    reject(...arguments);
                }
            })
        });
    });
}


var updateListItem = function(listName, itemId, object) {
    return new Promise((resolve, reject) => {
        loadRequestExecutor().then((executor) => {
            var itemType = GetItemTypeForListName(listName);
            var item = {
                "__metadata": {
                    "type": itemType
                },
                ...object
            };

            executor.executeAsync({
                url: `${appWebUrl}/_api/SP.AppContextSite(@target)/web/lists/getbytitle('${listName}')/items(${itemId})?@target='${hostWebUrl}'`,
                method: "POST",
                body: JSON.stringify(item),
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "content-type": "application/json;odata=verbose",
                    "X-RequestDigest": getRequestDigest(),
                    "IF-MATCH": "*",
                    "X-HTTP-Method": "MERGE"
                },
                success: function(data) {
                    resolve();
                },
                error: function() {
                    reject(...arguments);
                }
            })
        });
    });
}


export default {
    findListItem,
    createListItem,
    updateListItem,
    getUserId,
    getById
}
