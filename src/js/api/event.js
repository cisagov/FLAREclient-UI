import axios from '../config/axios';
import AppConfig from "../config/appConfig";

class EventService {
  fetchEvents = (jwt_token,page=0,numPerPage=10,orderBy='time',order='desc') => new Promise((resolve, reject) => {
    const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
    //console.log(`${AppConfig.endpoints.events}?page=${page}&size=${numPerPage}&sort=${orderBy},${order}`,axiosConfig);
    axios.get(`${AppConfig.endpoints.events}?page=${page}&size=${numPerPage}&sort=${orderBy},${order}`,axiosConfig)
      .then((response) => {
        //console.log(response)
        if (response.data) {
          resolve(response);
        } else {
          reject({error: 'Could not fetch events'});
        }
      })
      .catch((error) => {
        reject(error);
      });
  })
}

const eventService = new EventService();

export default eventService;
