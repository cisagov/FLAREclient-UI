import serverService from "../../api/server";
import {getServerCollections,clearServerCollections} from "./collections";
//import authService from "../../api/authorization";
import * as _ from 'lodash';

//ACTION_TYPES MUST FOLLOW <NOUN>_<VERB> convention
export const FETCH_SERVERS = 'FETCH_SERVERS';
export const FETCH_SERVER = 'FETCH_SERVER';

export const CREATE_SERVER = 'CREATE_SERVER';
export const UPDATE_SERVER = 'UPDATE_SERVER';
export const DELETE_SERVER = 'DELETE_SERVER';

export const REFRESH_SERVER = 'REFRESH_SERVER';

//export const UPDATE_SERVER_CREDENTIALS = 'UPDATE_SERVER_CREDENTIALS';
//export const DELETE_SERVER_CREDENTIALS = 'DELETE_SERVER_CREDENTIALS';

export function getServers() {
    return async (dispatch, getState) => {
        //console.log("-----Fetching Servers----")
        try {
            const fetched_servers = await serverService.fetchServers(getState().account.id_token);
            const servers = Object.values(fetched_servers.byLabel);
            dispatch({
                type: FETCH_SERVERS,
                payload: {
                    servers
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

export function getServer(id) {
    return async (dispatch, getState) => {
        //console.log(`-----Fetching Server: ${id}----`)
        try {
            const server = await serverService.fetchServer(getState().account.id_token,id);
            dispatch({
                type: FETCH_SERVER,
                payload: {
                    server
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

export function addServer(server) {
    return async (dispatch, getState) => {
        //console.log("-----Connecting Server----")
        try {
            const newServer = await serverService.addServer(getState().account.id_token,server);

            let servers = [...getState().servers.servers];
            servers.push(newServer);
            dispatch({
                type: CREATE_SERVER,
                payload: {
                    servers
                }
            });
            dispatch(getServerCollections(server.label));
        } catch (error) {
            throw error;
        }
    };
}

export function updateServer(originalLabel, updatedServer) {
    return async (dispatch, getState) => {
        //console.log("-----Updating Server----");
        try {
            const server = await serverService.updateServer(getState().account.id_token,updatedServer);

            let servers = [...getState().servers.servers];
            const index = _.findIndex(servers, (server) => {
                return server.label === originalLabel;
            });

            servers.splice(index, 1, server);

            dispatch({
                type: UPDATE_SERVER,
                payload: {
                    servers
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

export function refreshServer(label) {
    return async (dispatch, getState) => {
        //console.log("-----Refreshing Server----");
        try {
            const server = await serverService.refreshServer(getState().account.id_token,label);

            let servers = [...getState().servers.servers];
            const index = _.findIndex(servers, (server) => {
                return server.label === label;
            });

            servers.splice(index, 1, server);

            dispatch({
                type: REFRESH_SERVER,
                payload: {
                    servers
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

export function deleteServer(serverLabel) {
  return async (dispatch, getState) => {
    //console.log("-----Deleting Server----");
    try {
      let servers = [...getState().servers.servers];
      await serverService.deleteServer(getState().account.id_token,serverLabel);
      servers = servers.filter(e => e.label!==serverLabel);

      dispatch({
        type: DELETE_SERVER,
        payload: {
          servers
        }
      });
      dispatch(clearServerCollections(serverLabel));
    } catch (error) {
      throw error;
    }
  };
}
