import path from 'path';
import watch from 'gulp-watch';
import plumber from 'gulp-plumber';
import through2 from 'through2';
import gutil from 'gulp-util';
import packageJson from '../../../package.json';

export default (gulp, plugins)=>{
    return ()=>{
        return;// todo
        let srcRule = path.resolve('./server/**/*.js');
        let destPath = path.resolve('dist/');

        gutil.log(`srd ${(srcRule)}`);
        gutil.log(`dest ${(destPath)}`);

        console.log('Waiting for files changes...');

        return watch(srcRule)
            .pipe(plumber())
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.babel(packageJson.babel))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(through2.obj(function (file, enc, cb) {

                if (!file.path) {
                    cb();
                }

                this.push(file);
                gutil.log(`Babelify ${(file.path)}`);
                cb();
            }))
            .pipe(gulp.dest(destPath));
    }
};