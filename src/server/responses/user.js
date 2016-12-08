import HttpResponse from './httpResponse';

export default class Users extends HttpResponse {

    email;
    firstName;
    lastName;
    country;

    constructor({email, firstName, lastName, country}){
        super();
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.country = country;
    }
}