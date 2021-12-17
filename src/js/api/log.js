import axios from '../config/axios';
import AppConfig from "../config/appConfig";

class LogService {
    fetchLogs = (jwt_token) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.get(AppConfig.endpoints.logs, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: 'Could not fetch logs'});
                }
            })
            .catch((error) => {
                console.log(error)
                reject(error);
            });
    })

    updateLogs = (jwt_token, form_data) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        //console.log('updateLogs was called');
        axios.put(AppConfig.endpoints.logs, form_data, axiosConfig)
            .then((response) => {
                //console.log(response)
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    })
}

const logService = new LogService();

export default logService;
