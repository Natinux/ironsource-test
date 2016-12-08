import runSequence from 'run-sequence';

export default (gulp, plugins, options) => {
    runSequence.use(gulp);

    gulp
        .task('build', function(callback){
            runSequence('clean-dist', 'create-folders', 'babel', 'config', 'api-docs', 'browserify', callback);
        })
        .task('dev', ['build'], cb => {
            runSequence('babel-watch', cb);
        })
        .task('default', ['build']);
}