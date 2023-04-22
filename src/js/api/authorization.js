import axios from '../config/axios';
import AppConfig from "../config/appConfig";

class AuthorizationService {

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

    basicAuthLogin = (login, password) => new Promise((resolve, reject) => {
        //console.log(login, password)
        axios.post(AppConfig.endpoints.login, { username: login, password: password })
            .then((response) => {
                //console.log(response)
                if (response.data.id_token) {
                    resolve(response.data.id_token);
                } else {
                    reject(response.data.error);
                }
            })
            .catch((error) => {
                reject(error);
            });
    })
}

const authService = new AuthorizationService();

export default authService;
