import Db from '../utils/db';
import express from 'express';
import http from 'http';
import config from '../config';
import LogHelper from '../helpers/log';

process.stdin.resume();//so the program will not close instantly
let server;
const app = express();

function exitHandler(options, err) {
    if (err) console.log(err.stack);
    if(server) server.close();
    process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null));

export default new Promise((resolve, reject) => {

    LogHelper.init();

    Db.initialize(config.get('db:file:name') + '_test');

    let appInit = require('../initialize'); // loading app with all its imports

    appInit(app).then(() => {
        LogHelper.info('Application ready');
        resolve(app);
    }).catch(err => {
        reject(err);
    });
});