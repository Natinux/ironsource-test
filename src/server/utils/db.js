import levelup from 'levelup';
import LogHelper from '../helpers/log';
import deferred from './deferred';

export default class Db {

    static _db = undefined;

    static initialize(fileName){
        LogHelper.debug('Init database');

        if(Db._db){
            LogHelper.debug('Connection already exist');
            return Promise.resolve(Db._db);
        }

        LogHelper.debug('Create new connection');

        let def = deferred();

        Db._db = levelup(fileName, (err, db) => {
            if (err) return def.reject(err);
            LogHelper.info('DB ready');
            Db._db = db;
            def.resolve()
        });

        LogHelper.debug('New connection created');

        return def.promise;
    }

    static addModel(name){
        if(Db._db && name){
            return {
                get:(key, options, callback) => {
                    let def = deferred();
                    key = `${name}:${key}`;
                    Db._db.get(key, options, (err, value) => {
                        if (err) return def.reject(err);
                        def.resolve(JSON.parse(value));
                    });
                    return def.promise;
                },
                put:(key, value, options, callback) => {
                    let def = deferred();
                    key = `${name}:${key}`;
                    let data = value === 'string' ? value : JSON.stringify(value);
                    Db._db.put(key, data, options, (err) => {
                        if (err) return def.reject(err);
                        def.resolve(true);
                    });
                    return def.promise;
                },
                keys:() => {
                    let def = deferred();
                    let keys = [];
                    Db._db.createKeyStream()
                        .on('data', data => keys.push(data.replace(`${name}:`, '')))
                        .on('end', () => def.resolve(keys));
                    return def.promise;
                },
                values:() => {
                    let def = deferred();
                    let values = [];
                    Db._db.createValueStream()
                        .on('data', data => values.push(JSON.parse(data)))
                        .on('end', () => def.resolve(values));
                    return def.promise;
                }
            };
        }
    }
}