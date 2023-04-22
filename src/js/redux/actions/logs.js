import logService from "../../api/log";

//ACTION_TYPES MUST FOLLOW <NOUN>_<VERB> convention
export const FETCH_LOGS = 'FETCH_LOGS';
export const UPDATE_LOGS = 'UPDATE_LOGS';

export function getLogs() {
    return async (dispatch, getState) => {
        //console.log("-----Fetching Logs----")
        try {
            const logs = await logService.fetchLogs(getState().account.id_token);
            dispatch({
                type: FETCH_LOGS,
                payload: {
                    logs
                }
            });
        } catch (error) {
            throw error;
        }
    };
}

export function updateLogs(name,level) {
    return async (dispatch, getState) => {
        try {
            const response = await logService.updateLogs(getState().account.id_token, {name, level});
            dispatch({
                type: UPDATE_LOGS,
                payload: {
                    response
                }
            });
        } catch (error) {
            throw error;
        }
    };
}
