import axios from '../config/axios';
import AppConfig from "../config/appConfig";

class UserService {
    fetchUsers = (jwt_token) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.get(AppConfig.endpoints.users, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not fetch users"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    fetchUser = (jwt_token, login) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.get(AppConfig.endpoints.users+'/'+login, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not fetch user "+login});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    fetchAuthorities = (jwt_token) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.get(AppConfig.endpoints.authorities, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not fetch authorities"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    addUser = (jwt_token, user) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.post(AppConfig.endpoints.users, user, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not add user"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    updateUser = (jwt_token, user) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.put(AppConfig.endpoints.users, user, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not update user"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    deleteUser = (jwt_token, login) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.delete(AppConfig.endpoints.users + '/' + login, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not delete user"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })
}

const userService = new UserService();

export default userService;
