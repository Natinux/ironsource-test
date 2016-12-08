import * as types from '../constants/actionTypes';

const Users = (state = [], action) => {
  switch(action.type){
      case types.ADD_USERS:
          return action.users;
      default:
          return state;
  }
};

export default Users;