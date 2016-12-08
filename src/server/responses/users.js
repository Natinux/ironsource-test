import HttpResponse from './httpResponse';

export default class Users extends HttpResponse {

    users;

    constructor({users = []}){
        super();
        this.users = users;
    }
}