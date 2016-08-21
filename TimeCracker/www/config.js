var config = {
    API: {
        TenFeet_URL: 'https://api.10000ft.com',
        TenFeet_TOKEN: 'VkRpWURvdGI5Q3hQYnNLaHdHcmpVMDFBZWZzRWJBU1orcEJaMHJzUWdFN1NLTGhHM0wvS2VPT2sxV3pLCjNlM3UvSXdOYUxwcmtORWNGQlRZQ1MrOW1zV0dMZzNKOUc1YXVIY1pKd2xEWW1ZZm0yUUNWR1NjWXlNSwo1QS93WlREZQo'
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
        }
    }
};

export default config;
