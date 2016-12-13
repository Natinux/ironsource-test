import chai from 'chai';
import {before} from "mocha";
import {describe} from "mocha";
import UserAgent from '../../agents/user';

const assert = chai.assert;
const expect = chai.expect;
chai.should();

describe('user agent test', ()=> {

    it('add user', async () => {
        let ok = await UserAgent.saveUser({
            email:'email1@exp.com',
            firstName: 'user1',
            lastName: 'Doe',
            country: 'Canada'
        });

        assert.isTrue(ok, 'unable to save user data');
    });

    it('should retrieve user data', async () => {
        let user = await UserAgent.getUserByEmail('email1@exp.com');
        assert.isObject(user);
        assert.equal(user.lastName, 'Doe', 'unable to retrieve user data');
    });


});