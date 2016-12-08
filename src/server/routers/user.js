import express from 'express';
import path from 'path';
import UserAgent from '../agents/user';
import config from '../config';
import HttpHelper from '../helpers/http';
import UserResponse from '../responses/user';
import UsersResponse from '../responses/users';
import EmailsResponse from '../responses/emails';

const router = express.Router();

/**
 *
 * @api {get} /api/user List All Users
 * @apiVersion 0.0.1
 * @apiName ListUsers
 * @apiGroup User
 *
 *
 * @apiDescription List All Users
 *
 * @apiSuccess (Success 200) users
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "status":200,
 *      "users":[user1, user22, ..., userN],
 *
 *  }
 *
 * @apiError (Error 5xx) INTERNAL_ERROR 500
 */
router.get('/', async (req, res, next) => {
    try{
        let users = await UserAgent.getAllUsers();
        res.api(new UsersResponse({users}));
    }catch (err){
        next(err);
    }
});

/**
 *
 * @api {get} /api/user/emails List All Users Emails
 * @apiVersion 0.0.1
 * @apiName ListUserEmails
 * @apiGroup User
 *
 *
 * @apiDescription List All User Emails
 *
 * @apiSuccess (Success 200) users
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "status":200,
 *      "emails":[email1, email2, ..., emailN],
 *
 *  }
 *
 * @apiError (Error 5xx) INTERNAL_ERROR 500
 */
router.get('/emails', async (req, res, next) => {
    try{
        let emails = await UserAgent.getAllEmails();
        res.api(new EmailsResponse({emails}));
    }catch (err){
        next(err);
    }
});

/**
 *
 * @api {get} /api/user/:email Get User information
 * @apiVersion 0.0.1
 * @apiName GetUserInformation
 * @apiGroup User
 *
 *
 * @apiDescription Get User information by email
 *
 * @apiParam {String} email Email address of the user to fetch
 *
 * @apiSuccess (Success 200) users
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "status":200,
 *      "email": "email@example.com",
 *      "firstName": "John",
 *      "lastName": "Doe",
 *      "Country": "Albania"
 *
 *  }
 *
 * @apiError BAD_REQUEST 400 - Validation Error
 * @apiError (Error 5xx) INTERNAL_ERROR 500
 */
router.get('/:email', (req, res, next) => {
    req.assert('email', 'missing email').notEmpty().isEmail();
    next(HttpHelper.requestValidation(req));
}, async (req, res, next) => {
    try{
        let response = new UserResponse(await UserAgent.getUserByEmail(req.params.email));
        res.api(response);
    }catch (err){
        next(err);
    }
});

/**
 *
 * @api {post} /api/user Update User Record
 * @apiVersion 0.0.1
 * @apiName UpdateUserRecord
 * @apiGroup User
 *
 *
 * @apiDescription Update or save user record
 *
 * @apiParam {String} email Email address of the user to fetch
 * @apiParam {String} firstName First Name
 * @apiParam {String} lastName Last Name
 * @apiParam {String} country User Country
 *
 * @apiSuccess Success
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "status":200,
 *  }
 *
 * @apiError BAD_REQUEST 400 - Validation Error
 * @apiError (Error 5xx) INTERNAL_ERROR 500
 */
router.post('/', (req, res, next) => {
    req.assert('email', 'missing email').notEmpty().isEmail();
    req.assert('firstName', 'missing first name').notEmpty();
    req.assert('lastName', 'missing last name').notEmpty();
    req.assert('country', 'missing country name').notEmpty();
    next(HttpHelper.requestValidation(req));
}, async (req, res, next) => {
    try{
        await UserAgent.saveUser(req.body);
        res.api();
    }
    catch (err){
        next(err);
    }
});

export default router;