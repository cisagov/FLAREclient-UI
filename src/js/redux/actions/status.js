import statusService from "../../api/status";

//ACTION_TYPES MUST FOLLOW <NOUN>_<VERB> convention
export const FETCH_STATUS = 'FETCH_STATUS';

export function getStatus(page,numPerPage,orderBy,order) {
    return async (dispatch, getState) => {
        //console.log("-----Fetching Status----")
        try {
            const status = await statusService.fetchStatus(getState().account.id_token,page,numPerPage,orderBy,order);
            dispatch({
                type: FETCH_STATUS,
                payload: {
                    status
                }
            });
        } catch (error) {
            throw error;
        }
    };
}
