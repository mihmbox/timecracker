var config = {
    API: {
        TenFeet_URL: 'https://api.10000ft.com',
        TenFeet_TOKEN: ''
    },
    Lists: {
        Projects: {
            name: 'Projects',
            fields: {
                Title: 'Title',
                TenFtId: 'TenFtId'
            }
        },
        Timesheets: {
            name: 'Timesheets',
            fields: {
                Title: 'Title',
                Description: 'Description',
                Parent: 'Parent',
                Author:'Author',
                Created: 'Created',
                Start: 'Start',
                Date: 'Date',
                Hours: 'Hours',
                Project: 'Project',
                State: 'State'
            },
            States: {
                Stopped: 'Stopped',
                Running: 'Running'
            }
        },
        TimesheetTasks: {
            name: 'Timesheet Tasks',
            fields: {
                Title: 'Title',
                Timesheet: 'Timesheet'
            }
        }
    }
};

export default config;
