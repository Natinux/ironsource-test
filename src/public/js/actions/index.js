import * as types from '../constants/actionTypes';

export const addAlert = alert => ({type: types.ADD_ALERT, alert});
export const removeAlert = alertId => ({type: types.REMOVE_ALERT, alertId});
export const addUsers = users => ({type: types.ADD_USERS, users});

export const saveUser = user => ({userService}) => {
    if(!user) throw new Error("No user passed to saveUser action");
    return dispatch => userService.saveUser(user);
};

export const loadUsers = () => ({userService}) => {
    return dispatch => userService.loadUsers()
        .then(res => checkResponse(res, dispatch))
        .then(res => dispatch(addUsers(res.users)));
};

const checkResponse = (response, dispatch) => {
    let {status, reasons = [{message:'Unknown error'}]} = response;
    if (status != 200) {
        dispatch(addAlert({id: +new Date, ...reasons[0]}));
        return Promise.reject(response);
    }
    return Promise.resolve(response);
};