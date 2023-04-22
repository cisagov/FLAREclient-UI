import axios from '../config/axios';
import AppConfig from "../config/appConfig";

class AuditService {
  fetchAudits = (jwt_token,page=0,numPerPage=20,orderBy='timestamp',order='desc',startDate,endDate) => new Promise((resolve, reject) => {
    const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
    let queryParameters=`page=${page}&size=${numPerPage}&sort=${orderBy},${order}`;
    if (startDate) {
      queryParameters+=`&fromDate=${startDate}`;
    }
    if (endDate) {
      queryParameters+=`&toDate=${endDate}`;
    }
    //console.log(`${AppConfig.endpoints.audits}?${queryParameters}`);
    axios.get(`${AppConfig.endpoints.audits}?${queryParameters}`,axiosConfig)
      .then((response) => {
        //console.log(response)
        if (response.data) {
          resolve(response);
        } else {
          reject({error: 'Could not fetch audits'});
        }
      })
      .catch((error) => {
        reject(error);
      });
  })
}

const auditService = new AuditService();

export default auditService;
