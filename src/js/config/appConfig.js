/**
 This file will contain app configurations that will be used throughout the UI. Things like API
 end points, request settings or other things should be defined here.

 Also import of things like icons  should be done here

 **/

import build from './build';

// NOTE: If you are running this locally, you must create a file in the root directory (three
// directories up from this one, called .env
// Inside that file, include the line:   REACT_APP_MAIN_URL = 'https://localhost:8443'

const baseRestUrl = (process.env.REACT_APP_MAIN_URL ? process.env.REACT_APP_MAIN_URL : '') + (process.env.REACT_APP_BASE_PATH ? process.env.REACT_APP_BASE_PATH : '');

export default {
    build: build.build,
    version: '4.0',
    appId: 'flare-client-ui',
    displayName: 'FLAREclient',
    requestTimeout: 1500,
    userIdleTimeout: 900000,
    appClassification: 'UNCLASSIFIED//FOUO',
    requireAuthentication: true,
    endpoints:{
        authorities: `${baseRestUrl}/api/users/authorities`,
        audits: `${baseRestUrl}/management/audits`,
        events: `${baseRestUrl}/api/events`,
        login: `${baseRestUrl}/api/authenticate`,
        logs: `${baseRestUrl}/management/logs`,
        servers: `${baseRestUrl}/api/servers`,
        status: `${baseRestUrl}/api/status`,
        users: `${baseRestUrl}/api/users`
    },
    taxiiHeaders: {
        'Content-Type': 'application/taxii+json;version=2.1',
        'Accept': 'application/taxii+json;version=2.1'
    },
    allowedMimeTypes: ['text/xml','application/json'],
    // maxFileUploadSize will restrict uploads to a specific size.  Set to '0' to disable
    // this restriction
    maxFileUploadSize: 0
}

export const ENABLE_REDUX_DEBUG_LOGGING = true;
export const ENABLE_ROUTER_DEBUG_LOGGING = true;

