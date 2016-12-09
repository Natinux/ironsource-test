import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import expressHbs from 'express-handlebars';
import expressValidator from 'express-validator';
import bunyanRequest from 'bunyan-request';
import cors from 'cors';
import userAgent from 'express-useragent';
import config from './config';
import LogHelper from './helpers/log';
import ValidationHelper from './helpers/validation';
import HttpResponse from './responses/httpResponse';
import publicRouter from './routers/public';
import userRouter from './routers/user';
import BaseHttpError from './errors/http/base';
import {HttpNotFoundError} from './errors/http/index';

const middlwares = {
    async activeMaintenance(app){
        app.use((req, res, next) => {
            res.status(503).send('We are currently down for maintenance');
        });
        LogHelper.info('Added Middleware: checkForMaintenance');
    },
    async cors(app){
        app.use(cors());
        LogHelper.info('Added Middleware: CORS');
    },
    async static(app){
        app.use('/public', express.static(path.resolve(config.get('projectDir'), 'dist', 'public')));
        app.use('/docs', express.static(path.resolve(config.get('projectDir'), 'dist', 'public', 'docs')));

        LogHelper.info('Added Middleware: static');
    },
    async poweredBy(app){
        app.use((req, res, next) => {
            res.header('X-Powered-By', config.get('project:author') + ' IT');
            next();
        });
        LogHelper.info('Added Middleware: poweredBy');
    },
    async projectVersion(app){
        let version = config.get('version');

        app.use((req, res, next) => {
            res.header('X-Version', version);
            next();
        });

        LogHelper.info('Added Middleware: version');
    },
    async userAgent(app){
        app.use(userAgent.express());
        LogHelper.info('Added Middleware: User Agent');
    },
    async bodyParser(app){
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        LogHelper.info('Added Middleware: bodyParser');
    },
    async logger(app){
        app.use(bunyanRequest({
            logger: LogHelper.getLogger(),
            headerName: 'X-Request-Id'
        }));

        LogHelper.info('Added Middleware: logger');
    },
    async apiResponse(app){
        app.use((req, res, next) => {
            res.api = entity => {
                if(entity && entity instanceof HttpResponse){
                    res.json(Object.assign({status:200}, entity));
                }
                else{
                    res.status(200).send({status:200});
                }
            };
            next();
        });

        LogHelper.info('Added Middleware: apiResponse');
    },
    async validator(app){
        app.use(expressValidator({
            customValidators:ValidationHelper.allValidations(),
            errorFormatter: (param, msg, value) => {
                return {
                    param: param,
                    message: msg,
                    value: value
                };
            }
        }));

        LogHelper.info('Added Middleware: validator');
    },
    async viewEngine(app){
        app.set('views', path.resolve(config.get('projectDir'), 'src', 'views'));
        app.engine('.hbs', expressHbs({
            layoutsDir : path.resolve(config.get('projectDir'), 'src', 'views', 'layouts'),
            partialsDir : path.resolve(config.get('projectDir'), 'src', 'views', 'partials'),
            defaultLayout: 'main',
            extname: '.hbs'
        }));
        app.set('view engine', '.hbs');
    },
    async routers(app){
        // Non api
        app.use('/api/user', userRouter);
        app.use('/', publicRouter);

        LogHelper.info('Added Middleware: routers');
    },
    error(app){
        app.use((err, req, res, next) => {

            if(typeof err === 'string'){
                err = new Error(err);
            }

            res.status(err.status || 500);


            LogHelper.error(err);

            if(req.log){
                req.log.info(err, 'error');
            }

            // Single error case
            let params = {
                error: err.message,
                status: err.status
            };

            // Multiple errors case
            if(err instanceof BaseHttpError && err.errors instanceof Array){
                params['reasons'] = err.errors;
            }

            res.json(params);
        });

        LogHelper.info('Added Middleware: error');
    }
};


export default async function(app){
    app.set('env', config.get('env:name'));

    try{
        if(config.get('maintenance:inMaintenance')) {
            await middlwares.activeMaintenance(app);
        }

        await middlwares.projectVersion(app);
        await middlwares.poweredBy(app);
        await middlwares.cors(app);
        await middlwares.static(app);
        await middlwares.userAgent(app);
        await middlwares.bodyParser(app);
        await middlwares.logger(app);
        await middlwares.apiResponse(app);
        await middlwares.validator(app);
        await middlwares.viewEngine(app);
        await middlwares.routers(app);
        await middlwares.error(app);
    }catch(err){
        LogHelper.error(err);
    }


    LogHelper.info('Done middlewares');
    return true;
}