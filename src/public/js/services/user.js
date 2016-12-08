import 'whatwg-fetch';
import BaseService from './base';

export default class UserService extends BaseService{

    /**
     * Get user data
     * @param username
     * @returns {username, email}
     */
    async get(username){
        let requst = new Request(`${this.baseUrl}/api/user/${username}`);
        return fetch(request).then(response => response.json());
    }

    async saveUser(user){
        let request = new Request(`${this.baseUrl}/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        return fetch(request).then(response => response.json());
    }

    async loadUsers(){
        let request = new Request(`${this.baseUrl}/api/user`);
        return fetch(request).then(response => response.json());
    }
}