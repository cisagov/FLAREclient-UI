import eventService from "../../api/event";

//ACTION_TYPES MUST FOLLOW <NOUN>_<VERB> convention
export const FETCH_EVENTS = 'FETCH_EVENTS';

export function getEvents(page,numPerPage,orderBy,order) {
    return async (dispatch, getState) => {
        //console.log("-----Fetching Events----")
        try {
            const events = await eventService.fetchEvents(getState().account.id_token,page,numPerPage,orderBy,order);
            dispatch({
                type: FETCH_EVENTS,
                payload: {
                    events
                }
            });
        } catch (error) {
            throw error;
        }
    };
}
