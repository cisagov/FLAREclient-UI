import axios from '../config/axios';
import AppConfig from "../config/appConfig";

class ServerService {
    fetchServers = (jwt_token) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.get(AppConfig.endpoints.servers, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: 'Could not fetch servers'});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    fetchServer = (jwt_token, label) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.get(AppConfig.endpoints.servers + '/' + label, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: 'Could not fetch server '+label});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    addServer = (jwt_token, server) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.post(AppConfig.endpoints.servers, server, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not add server"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    updateServer = (jwt_token, server) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.post(AppConfig.endpoints.servers, server, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not update server"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    refreshServer = (jwt_token, label) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.post(AppConfig.endpoints.servers + '/' + label + '/refresh', null, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not refresh server"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    deleteServer = (jwt_token, label) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.delete(AppConfig.endpoints.servers + '/' + label, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not delete server"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })
}

const serverService = new ServerService();

export default serverService;
