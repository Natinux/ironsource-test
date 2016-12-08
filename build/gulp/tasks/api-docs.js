import path from 'path';
import apidoc from 'apidoc';
import gutil from 'gulp-util';
import paths from '../paths';
import packageJson from '../../../package.json';

export default (gulp, plugins) => {

    return () => {

        let distPath = path.resolve(process.cwd(), paths.base.dest);
        let routersPath = path.resolve(distPath, 'server', 'routers');
        let destPath = path.resolve(process.cwd(), paths.base.dest, 'public', 'docs');

        let opts = {
            src: routersPath,
            dest: destPath,
            silent: true,
            includeFilters: [ ".*\\.js$" ]
        };

        return new Promise((resolve, reject) => {

            let chunk = apidoc.createDoc(opts);

            if(typeof chunk === 'object') {
                gutil.log(packageJson.name, gutil.colors.green('Apidoc created...   [  '+ gutil.colors.cyan(JSON.parse(chunk.project).name) +'  ] '));
                resolve();
            } else if(chunk === true){
                gutil.log(packageJson.name, gutil.colors.green('Apidoc created... '));
                resolve();
            }else{
                reject(new gutil.PluginError(packageJson.name, 'Execution terminated (set \" silent: false \" in api-docs.js task for details. '))
            }
        });
    };
};