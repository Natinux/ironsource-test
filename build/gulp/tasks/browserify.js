import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import source from 'vinyl-source-stream2';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import through2 from 'through2';
import path from 'path';
import packageJson from '../../../package.json';

function compile(gulp, plugins, options){

    let bundler = browserify('./src/public/js/bootstrap.js', { debug: true });

    if(options.w){
        bundler = watchify(bundler);
        bundler.on('update', recompile);
    }

    bundler.transform('browserify-css', {global: true});
    bundler.transform(babelify.configure(packageJson.babel));

    function recompile(){
        gutil.log('Rebound browserify...');
        return bundler.bundle()
            .on("error", handleError)
            .pipe(source('bundle.js'))
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/public'))
            .pipe(through2.obj(function (file, enc, cb) {

                if (!file.path) {
                    cb();
                }

                gutil.log(`rewrote ${path.basename(file.path)}`);
                cb()
            }));
    }

    return recompile();
}

function handleError(err){
    let message = [
        gutil.colors.red("Browserify compile error:"),
        err.message,
    ];
    let details = err.annotated || err.codeFrame;

    if(details){
        message = message.concat([
            "\n\t",
            gutil.colors.cyan("details:"),
            details
        ]);
    }
    gutil.log.apply(null, message);
    this.emit('end');
}

export default (gulp, plugins, options)=>{
    return (cb) => {

        return compile(gulp, plugins, options);
    }
}