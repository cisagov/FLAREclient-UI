import collectionService from "../../api/collection";

//ACTION_TYPES MUST FOLLOW <NOUN>_<VERB> convention
export const FETCH_SERVER_COLLECTIONS = 'FETCH_SERVER_COLLECTIONS';
export const FETCH_CONTENTS = 'FETCH_CONTENTS';
export const FETCH_ACTIVITIES = 'FETCH_ACTIVITIES';
export const FETCH_CONTENT_DETAIL = 'FETCH_CONTENT_DETAIL';
export const FETCH_MANIFEST = 'FETCH_MANIFEST';
export const CLEAR_COLLECTIONS = 'CLEAR_COLLECTIONS';
export const CLEAR_SERVER_COLLECTIONS = 'CLEAR_SERVER_COLLECTIONS';
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const VALIDATE_FILE = 'VALIDATE_FILE';
export const REQUEST_DOWNLOAD = "REQUEST_DOWNLOAD";
export const GET_RECURRING = "GET_RECURRING";
export const STOP_RECURRING = "STOP_RECURRING";
export const PURGE_COLLECTION = "PURGE_COLLECTION";

/**
 * This function is the action that fetches the collections associated with a Server.  
 * @param {*} serverLabel - Server Label
 * @returns {async<unknown>}
 */
export function getServerCollections(serverLabel) {
    return async (dispatch, getState) => {
        //console.log(`-----Fetching Collections: ${serverLabel} ----`)
        try {
            const collections = await collectionService.fetchServerCollections(getState().account.id_token, serverLabel);
            dispatch({
                type: FETCH_SERVER_COLLECTIONS,
                payload: {
                    serverLabel,
                    collections
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

/**
* This function is an action that is just a passthrough to reset the collections.
 */
export function clearCollections() {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: CLEAR_COLLECTIONS,
            });
        } catch (error) {
            throw error;
        }
    };
}

/**
* This function is an action that is just a passthrough to reset the collection for a specific server.
 */
export function clearServerCollections(serverLabel) {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: CLEAR_SERVER_COLLECTIONS,
                payload: {
                    serverLabel
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

/**
 * This function is the action that gets the contents associated with a collection.
 * @param {*} collectionId
 * @returns {async<unknown>}
 */
export function getContents(serverLabel,collectionId,page,numPerPage,orderBy,order) {
    return async (dispatch, getState) => {
        try {
            const contents = await collectionService.fetchContents(getState().account.id_token, serverLabel, collectionId, page, numPerPage, orderBy, order);
            dispatch({
                type: FETCH_CONTENTS,
                payload: {
                    collectionId,
                    contents
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

export function getContentDetail(serverLabel,collectionId,contentId) {
    return async (dispatch, getState) => {
        try {
            const content = await collectionService.fetchContentDetail(getState().account.id_token, serverLabel, collectionId, contentId);
            dispatch({
                type: FETCH_CONTENT_DETAIL,
                payload: {
                    content
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

/**
 * This function is the action that gets the activities associated with a collection.
 * @param {*} collectionId
 * @returns {async<unknown>}
 */
export function getActivities(serverLabel,collectionId,page,numPerPage,orderBy,order) {
    return async (dispatch, getState) => {
        try {
            const activities = await collectionService.fetchActivities(getState().account.id_token, serverLabel, collectionId, page, numPerPage, orderBy, order);
            dispatch({
                type: FETCH_ACTIVITIES,
                payload: {
                    collectionId,
                    activities
                }
            });
        } catch (error) {
            dispatch({
                type: FETCH_ACTIVITIES,
                payload: {
                    collectionId,
                    activities: {headers:{'x-total-count':'0'}}
                }
            });
            throw error;
        }
    };
}

/**
 * This function is the action that uploads file to a collection.
 * @param {*} serverLabel
 * @param {*} collectionId
 * @param {*} uploadFiles
 * @returns {async<unknown>}
 */
export function uploadFiles(serverLabel,collectionId,uploadFiles) {
    return async (dispatch, getState) => {
        try {
            const response = await collectionService.uploadFiles(getState().account.id_token, serverLabel, collectionId, uploadFiles);
            dispatch({
                type: UPLOAD_FILE,
                payload: {
                    response
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

/**
 * This function is the action that validates files for a collection.
 * @param {*} serverLabel
 * @param {*} collectionId
 * @param {*} uploadFiles
 * @returns {async<unknown>}
 */
export function validateFiles(serverLabel,collectionId,uploadFiles) {
    return async (dispatch, getState) => {
        try {
            const validations = await collectionService.validateFiles(getState().account.id_token, serverLabel, collectionId, uploadFiles);
            dispatch({
                type: VALIDATE_FILE,
                payload: {
                    validations
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

/**
 * This function is the action that starts a download from a collection on the backend
 * @param {*} serverLabel
 * @param {*} collectionId
 * @param {*} formData
 * @returns {async<unknown>}
 */
export function requestDownload(serverLabel,collectionId,formData) {
    return async (dispatch, getState) => {
        try {
            const response = await collectionService.requestDownload(getState().account.id_token, serverLabel, collectionId, formData);
            dispatch({
                type: REQUEST_DOWNLOAD,
                payload: {
                    response
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

/**
 * This function is the action that fetches a manifest from a collection on the backend
 * @param {*} serverLabel
 * @param {*} collectionId
 * @param {*} formData
 * @returns {async<unknown>}
 */
export function getManifest(serverLabel,collectionId,formData,clear) {
    return async (dispatch, getState) => {
        try {
            const manifest = await collectionService.fetchManifest(getState().account.id_token, serverLabel, collectionId, formData);
            dispatch({
                type: FETCH_MANIFEST,
                payload: {
                    collectionId,
                    manifest,
                    clear
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

/**
 * This function is the action that finds whether a recurring download is currently set up for this collection
 * @param {*} serverLabel
 * @param {*} collectionId
 * @returns {async<unknown>}
 */
export function getRecurring(serverLabel,collectionId) {
    return async (dispatch, getState) => {
        try {
            const contents = await collectionService.getRecurring(getState().account.id_token, serverLabel, collectionId);
            dispatch({
                type: GET_RECURRING,
                payload: {
                    serverLabel,
                    collectionId,
                    contents
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

/**
 * This function is the action that stops a recurring download for this collection
 * @param {*} serverLabel
 * @param {*} collectionId
 * @returns {async<unknown>}
 */
export function stopRecurring(serverLabel,collectionId) {
    return async (dispatch, getState) => {
        try {
            await collectionService.stopRecurring(getState().account.id_token, serverLabel, collectionId);
            dispatch({
                type: STOP_RECURRING,
                payload: {
                    serverLabel,
                    collectionId
                }
            });
        } catch (error) {
            throw error;
        }
    };
  }
 export function deleteCollection(serverLabel, collectionId) {
  return async (dispatch, getState) => {
    //console.log("-----Deleting Collection----");
    try {
      let servers = [...getState().servers.servers];
      await collectionService.deleteCollection(getState().account.id_token,serverLabel, collectionId);
            dispatch({
                type: PURGE_COLLECTION,
                payload: {
                    serverLabel,
                    collectionId
                }
            });
    } catch (error) {
      throw error;
    }
  };
}
