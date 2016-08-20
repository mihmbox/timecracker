import axios from 'axios'
import queryString from 'query-string';
import config from '~/www/config'
import spListUtils from './util/sp-app-list-utils'

var list = config.Lists.Projects;

// https://blogs.msdn.microsoft.com/uksharepoint/2013/02/22/manipulating-list-items-in-sharepoint-hosted-apps-using-the-rest-api/
var __importProjectsFrom10KFt = function(projects, callbacks) {
    var promise = new Promise((resolve, reject) => {

        ExecuteOrDelayUntilScriptLoaded(function() {
            var clientContext = SP.ClientContext.get_current();
            var appContextSite = new SP.AppContextSite(clientContext, hostWebUrl);
            var oList = appContextSite.get_web().get_lists().getByTitle(list.name);


            var next = function() {
                currentItemIdx++;
                if (currentItemIdx < projects.length) {
                    createNextItem();
                } else {
                    // finished with all items
                    resolve();
                }
            }

            var createNextItem = function() {
                var project = projects[currentItemIdx];

                callbacks.beforeImport && callbacks.beforeImport(project);
                // Create project
                var itemCreateInfo = new SP.ListItemCreationInformation();
                var listItem = oList.addItem(itemCreateInfo);
                listItem.set_item(list.fields.Title, project.name);
                listItem.set_item(list.fields.TenFtId, project.id);

                listItem.update();
                clientContext.executeQueryAsync(function() {
                    callbacks.imported && callbacks.imported(project);
                    callbacks.itemProcessed(project);
                    next();
                }, function(sender, args) {
                    callbacks.error && callbacks.error(project, args.get_message());
                    callbacks.itemProcessed(project);
                    next();
                });
            }

            var currentItemIdx = 0;
            if (projects.length) {
                createNextItem();
            } else {
                resolve();
            }
        }, "sp.js");
    });

    return promise;
}




var importProjectsFrom10KFt = function(projects, callbacks) {
    var promise = new Promise((resolve, reject) => {
        var next = function() {
            currentItemIdx++;
            if (currentItemIdx < projects.length) {
                migrateNextProject();
            } else {
                // finished with all items
                resolve();
            }
        }

        var migrateNextProject = function() {
            var project = projects[currentItemIdx];
            callbacks.beforeImport && callbacks.beforeImport(project);

            spListUtils.findListItem(list.name, `${list.fields.TenFtId} eq '${project.id}'`).then(function(data) {
                var obj = {};
                obj[list.fields.Title] = project.name.trim();
                obj[list.fields.TenFtId] = project.id;

                var promise = '';
                var willBeCreated = !data.results.length;
                if(willBeCreated) {
                    // Create project
                    promise = spListUtils.createListItem(list.name, obj);
                } else {
                    // Update project Properties
                    var promises = data.results.map((v) => spListUtils.updateListItem(list.name, v.Id, obj));
                    promise = Promise.all(promises)
                }

                promise.then(function(items) {
                    callbacks.imported && callbacks.imported(project, willBeCreated);
                }).catch(function(args) {
                    callbacks.error && callbacks.error(project, args.get_message());
                }).then(function() {
                    callbacks.itemProcessed(project);
                    next();
                });
            });
        }

        var currentItemIdx = 0;
        if (projects.length) {
            migrateNextProject();
        } else {
            resolve();
        }
    });

    return promise;
}

export default {
    importProjectsFrom10KFt
}
