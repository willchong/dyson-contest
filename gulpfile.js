var gulp = require('gulp');
var changed = require('gulp-changed');
var watch = require('gulp-watch');
var gulpCopy = require('gulp-copy');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sizereport = require('gulp-sizereport');
var autoprefixer = require('gulp-autoprefixer');
var stripDebug = require('gulp-strip-debug');
var htmlreplace = require('gulp-html-replace');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var flatten = require('gulp-flatten');
var extender = require('gulp-html-extend');
var del = require('del');



// gulp.task('default', function() {
//   // place code for your default task here
// });

//generate size report for the dist folder
gulp.task('sizereport', function () {
    return gulp.src(['dist/*', 'dist/*/**'])
        .pipe(sizereport());
});

gulp.task('prefixcss', function () {
    return gulp.src('dist/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/'));
});

//convert sass to css
gulp.task('sass', function () {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
});

//concat and uglify scripts
gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('script.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

//source renaming after minification + recombination
gulp.task('html-replace', function() {
  	gulp.src('src/index.html')
        .pipe(htmlreplace({
                'css': 'css/poo.css',
                'js': 'js/wtf.js'
        }))
        .pipe(gulp.dest('src/'));
    // gulp.src('src/pages/*.html')
    //     .pipe(htmlreplace({
    //             'css': '../css/poo.css',
    //             'js': '../js/poo.js'
    //     }))
    //     .pipe(gulp.dest('src/pages'));
});


gulp.task('extend', function () {
    gulp.src('src/*.html')
        .pipe(extender({annotations:false,verbose:false}))
        .pipe(gulp.dest('dist/'));

});
// gulp.task('extend:pages', function () {
//     gulp.src('src/pages/*.html')
//         .pipe(extender({annotations:false,verbose:false}))
//         .pipe(gulp.dest('dist/pages/'));
// });

gulp.task('fonts', function () {
    return gulp.src('*', { cwd: 'src/fonts' })
        .pipe(gulpCopy('dist/fonts'));
});

gulp.task('imagemin', function () {
    return gulp.src(['src/img/*','src/img/*/*'])
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/**/*.html', ['extend']);
    gulp.watch('src/img/*.*', ['imagemin']);
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/fonts', ['fonts']);    
});

gulp.task('flatten', function() {
	gulp.src('./src/*.html')
	  .pipe(flatten())
	  .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function () {
  return del([
    'dist/',
  ]);
});

gulp.task('default', ['imagemin', 'sass', 'scripts', 'extend', 'fonts', 'watch']);
gulp.task('build', ['imagemin', 'html-replace', 'sass', 'scripts']);