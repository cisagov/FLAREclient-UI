import auditService from "../../api/audit";

//ACTION_TYPES MUST FOLLOW <NOUN>_<VERB> convention
export const FETCH_AUDITS = 'FETCH_AUDITS';

export function getAudits(page,numPerPage,orderBy,order,startDate,endDate) {
    return async (dispatch, getState) => {
        //console.log("-----Fetching Audits----")
        try {
            const audits = await auditService.fetchAudits(getState().account.id_token,page,numPerPage,orderBy,order,startDate,endDate);
            dispatch({
                type: FETCH_AUDITS,
                payload: {
                    audits
                }
            });
        } catch (error) {
            throw error;
        }
    };
}
