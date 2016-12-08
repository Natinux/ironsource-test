import Db from './utils/db';
import express from 'express';
import http from 'http';
import path from 'path';
import config from './config';
import LogHelper from './helpers/log';

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

export default new Promise(async (resolve, reject) => {

    LogHelper.init();

    try{
        LogHelper.debug('App starting...');
        await Db.initialize(path.resolve(config.get('projectDir'), config.get('db:file:name')));

        let appInit = require('./initialize'); // loading app with all its imports
        await appInit(app);

        // Create HTTP server
        LogHelper.info('Starting HTTP server...');
        server = http.createServer(app);
        let port = process.env.PORT || config.get('http:port') || 80;

        server.on('error', e => {
            if (e.code == 'EADDRINUSE') {
                LogHelper.info(`Address ${e.address}:${e.port} in use, retrying...`);
                setTimeout(() => {
                    server.close();
                    server.listen(port);
                }, 1000);
            }
        });

        // Start the HTTP server
        await new Promise(res => {
            server.listen(port, res);
        });

        LogHelper.info('HTTP Server started at port ' + server.address().port);
        resolve(app);
    }catch(e){
        LogHelper.info('Error');
        LogHelper.error(e);
        reject();
    }
});