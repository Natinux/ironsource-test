import HttpResponse from './httpResponse';

export default class Users extends HttpResponse {

    emails;

    constructor({emails = []}){
        super();
        this.emails = emails;
    }
}