import {UserModel} from '../models';

export default class UserAgent {

    static async getAllUsers(){
        return UserModel.values();
    }

    static async getAllEmails(){
        return UserModel.keys();
    }

    static getUserByEmail(email){
        return UserModel.get(email);
    }

    static saveUser(user){
        return UserModel.put(user.email, user);
    }
}