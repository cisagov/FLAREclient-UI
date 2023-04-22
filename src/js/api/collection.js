import axios from '../config/axios';
import AppConfig from "../config/appConfig";

class CollectionService {
    /**
     * This function fetches the collections associated with a Server.  This function is used for TAXII 1 and 2 servers.
     * 
     * @param basicAuthObject - the username and password combined to be inserted into the headers to be evaluated in the backed, this will eventually be replaced with a JWT
     * @param taxiiServerId - the id associated with a TAXII server.
     * @returns {Promise<unknown>} -- Server response
     */
    fetchServerCollections = (jwt_token, taxiiServerId) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        //console.log(`fetchServerCollections -${AppConfig.endpoints.servers}/${taxiiServerId}/collections`);
        axios.get(`${AppConfig.endpoints.servers}/${taxiiServerId}/collections`, axiosConfig)
            .then((response) => {
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not fetch collections"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    });

    /**
     * This function fetches the contents associated with a TAXII collection.
     * 
     * @param {string} jwt_token - Authentication token
     * @param {string} server_label - The label of the server for the collection
     * @param {string} collection_id - The ID for the collection
     * @param {string} page - The page of data to retrieve
     * @param {string} numPerPage - The number of items to display per page
     * @param {string} orderBy - The property of the data to sort by
     * @param {string} order - The order to display (asc or desc)
     * @returns {Promise<unknown>} -- Server response
     */
    fetchContents = (jwt_token, server_label, collection_id, page, numPerPage, orderBy, order) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        //console.log(`fetchContents - ${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/view?page=${page}&size=${numPerPage}&sort=${orderBy},${order}`);
        axios.get(`${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/view?page=${page}&size=${numPerPage}&sort=${orderBy},${order}`, axiosConfig)
            .then((response) => {
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not fetch contents"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    /**
     * This function fetches the content associated the contentId
     * 
     * @param {object} basicAuthObject - Object with username and password.
     * @param {string} taxiiCollectionId - Id to the collection.
     * @returns {Promise<unknown>} -- Server response
     */
    fetchContentDetail = (jwt_token, server_label, collectionId, contentId) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        //console.log(`fetchContents - ${AppConfig.endpoints.servers}/${server_label}/collections/${collectionId}/view/${contentId}`, axiosConfig);
        axios.get(`${AppConfig.endpoints.servers}/${server_label}/collections/${collectionId}/view/${contentId}`, axiosConfig)
            .then((response) => {
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not fetch contents"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    /**
     * This function fetches the activities associated with a TAXII collection.
     * 
     * @param {string} jwt_token - Authentication token
     * @param {string} server_label - The label of the server for the collection
     * @param {string} collection_id - The ID for the collection
     * @param {string} page - The page of data to retrieve
     * @param {string} numPerPage - The number of items to display per page
     * @param {string} orderBy - The property of the data to sort by
     * @param {string} order - The order to display (asc or desc)
     * @returns {Promise<unknown>} -- Server response
     */
    fetchActivities = (jwt_token, server_label, collection_id, page, numPerPage, orderBy, order) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        //console.log(`d - ${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/activities?page=${page}&size=${numPerPage}&sort=${orderBy},${order}`);
        axios.get(`${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/activities?page=${page}&size=${numPerPage}&sort=${orderBy},${order}`, axiosConfig)
            .then((response) => {
                if (response.data) {
                    resolve(response);
                } else {
                    reject({error: "Could not fetch activities"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })


    uploadFiles = (jwt_token, server_label, collection_id, form_data) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token }, timeout: 700 * 1000 };
        console.log('[ ] Upload files begin ...');
        axios.post(`${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/upload`, form_data, axiosConfig)
            .then((response) => {
                console.log('[*] Upload files response: ', response);
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not upload file"});
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('[x] Upload files error - server responded with the following: ');
                    console.log('Data: ', error.response.data);
                    console.log('Status: ', error.response.status);
                    console.log('Headers: ', error.response.headers);
                } else if (error.request) {
                    console.log('[x] Upload files error - made following request, but there was no response:');
                    console.log(error.request);
                } else {
                    console.log('[x] Upload files error - error preparing the request: ' + error.message);
                }
                reject(error);
            });
    })

    validateFiles = (jwt_token, server_label, collection_id, form_data) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        //console.log('validateFiles was called');
        axios.post(`${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/validate`, form_data, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not validate file"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    requestDownload = (jwt_token, server_label, collection_id, form_data) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        //console.log('requestDownload was called');
        axios.post(`${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/download`, form_data, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not download file"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    fetchManifest = (jwt_token, server_label, collection_id, query_string) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        //console.log('fetchManifest was called');
        let URL = `${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/manifest`;
        if (query_string.length>0) {
          URL+='?' + query_string;
        }
        axios.get(URL, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not fetch manifest"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    getRecurring = (jwt_token, server_label, collection_id) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        //console.log(`${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/download/recurring`);
        axios.get(`${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/download/recurring`, axiosConfig)
            .then((response) => {
                if (Object.keys(response).includes("data")) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not fetch recurring status"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })

    stopRecurring = (jwt_token, server_label, collection_id) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.delete(`${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}/download/recurring`, axiosConfig)
            .then((response) => {
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not delete recurring status"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })
    
    
    deleteCollection = (jwt_token, server_label, collection_id) => new Promise((resolve, reject) => {
        const axiosConfig = { headers: { "Authorization": "Bearer "+jwt_token } };
        axios.delete(`${AppConfig.endpoints.servers}/${server_label}/collections/${collection_id}`, axiosConfig)
            .then((response) => {
                //console.log(response)
                if (response.data) {
                    resolve(response.data);
                } else {
                    reject({error: "Could not delete this connection"});
                }
            })
            .catch((error) => {
                reject(error);
            });
    })
}

const collectionService = new CollectionService();

export default collectionService;
