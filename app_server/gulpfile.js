    //gulpfile.js

    let gulp = require('gulp');
    let ts = require('gulp-typescript');
    let clean = require('gulp-clean');
    let tsProject = ts.createProject('tsconfig.json', { "sourceMap": false }); //使用tsconfig.json文件配置tsc
    let exec = require('child_process').exec;

    let child;
    //目录常量
    const folders = ["model", "controller", "routes", "enum", "helper"];
    const tsps = folders.map(item => {
        return ts.createProject('tsconfig.json', { "sourceMap": false });
    });
    const PATHS = {
        scripts: folders.map(item => `./${item}/**/*.ts`),
        output: './build/**/',
    };
    folders.forEach((item, index) => {
        gulp.task('build-ts-' + item, function() {
            gulp.src(`./${item}/**/*.ts`)
                .pipe(tsps[index]())
                .pipe(gulp.dest(`./build/${item}/`));
        });
        gulp.task('watch-ts-' + item, function() {
            gulp.watch(`./${item}/**/*.ts`, ['build-ts-' + item]);
        });
    });
    gulp.task('build-ts', function() {
        gulp.src("./*.ts").pipe(tsProject()).pipe(gulp.dest(`./build/`));
    });
    gulp.task('watch-ts', function() {
        gulp.watch(`./*.ts`, ['build-ts']);
    });
    //自动重启服务器
    gulp.task('restart', function() {
        child = exec('pm2 stop all&pm2 delete all&pm2 start bin/www', (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
    });
    //开发任务
    // gulp.task('dev', ['build-ts', 'restart', 'watch-ts']);
    gulp.task('default', ['build-ts', 'watch-ts', ...folders.map(item => `build-ts-${item}`), ...folders.map(item => `watch-ts-${item}`)]);