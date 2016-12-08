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

    // Create HTTP server
    LogHelper.info('Starting HTTP server...');
    let server = http.createServer(app);
    let port = process.env.PORT || config.get('http:port') || 80;

    server.on('error', e => {
        if (e.code == 'EADDRINUSE') {
            LogHelper.info('Address in use, retrying...');
            return setTimeout(() => {
                server.close();
                server.listen(port);
            }, 1000);
        }
    });

    appInit(app).then(ok => {
        server.listen(port, () => {
            LogHelper.info('HTTP Server started at port ' + server.address().port);
            resolve(app);
        });
    }).catch(err => {
        reject(err);
    });
});