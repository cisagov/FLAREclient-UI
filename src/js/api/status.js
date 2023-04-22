import axios from '../config/axios';
import AppConfig from "../config/appConfig";

class StatusService {

  setAxiosInterceptors = ({ onLogout }) => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("error")
        }

        return Promise.reject(error);
      }
    );
  };

  fetchStatus = (jwt_token,page,numPerPage,orderBy,order) => new Promise((resolve, reject) => {
    const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
    //console.log(`${AppConfig.endpoints.status}?page=${page}&size=${numPerPage}&sort=${orderBy},${order}`,axiosConfig);
    axios.get(`${AppConfig.endpoints.status}?page=${page}&size=${numPerPage}&sort=${orderBy},${order}`,axiosConfig)
      .then((response) => {
        //console.log(response)
        if (response.data) {
          resolve(response);
        } else {
          reject({error: 'Could not fetch status'});
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

    clearErrorCount = (jwt_token,status_id) => new Promise((resolve, reject) => {
      const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
      console.log('[ ] Clear status(initial->service->api) at url: ' + `${AppConfig.endpoints.status}/${status_id}/clear`);
      axios.get(`${AppConfig.endpoints.status}/${status_id}/clear`,axiosConfig)
        .then((response) => {
//          console.log('[*] Clear error for ' + status_id + ' response: ', response);
          if (response.status == 200) {
            resolve(response);
          } else {
            reject({error: 'Could not clear status for id=' + status_id});
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
}

const statusService = new StatusService();

export default statusService;
