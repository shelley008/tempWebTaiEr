var gulp = require('gulp');
//sass
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
//压缩html
var htmlmin = require('gulp-htmlmin');
//压缩图片文件
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
//压缩javascript文件，减小文件大小
var uglify = require('gulp-uglify');
//热更新
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const babel = require('gulp-babel');


gulp.task('default',function(){
  console.log('test启动成功')
})

gulp.task('html', () => {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
   return gulp.src('src/view/**/*.html')
        .pipe(htmlmin(options))
        .pipe(fileinclude())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream())
});

gulp.task('sass', () => {
    return gulp.src("src/style/entry.scss")
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(autoprefixer('last 4 version'))
        .pipe(gulp.dest('dist/style'))
        .pipe(browserSync.stream())
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/style'))
        .pipe(browserSync.stream());
});

gulp.task('images',() => {
    //要处理的图片目录为images目录下的所有的.jpg .png .gif 格式的图片;
    return gulp.src('src/images/**/*.{jpg,png,gif,svg,ico}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
})


gulp.task('js',() => {
    return gulp.src('src/js/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
})


gulp.task('serve', ['sass', 'images','html', 'js'], () => {
    browserSync.init({
        server: "dist"
    });
    gulp.watch("src/style/**/*.scss", ['sass']);
    gulp.watch("src/view/**/*.html", ['html']);
    gulp.watch("src/images/**/*.*", ['images']);
    gulp.watch("src/js/*.js", ['scripts']);
});

gulp.task('default', ['sass', 'images', 'html', 'js'], () => {
    gulp.start("serve","html","sass","images","js")
})



// gulp.task('watch',['sass','js','html','images'],function(){
//     gulp.watch('src/*.scss',['sass']);
//     gulp.watch('src/js/*.js',['js']);
//     gulp.watch('src/images/**/*.*',['images']);
//     gulp.watch('src/view/*.html',['html']);
// })
// gulp.task("default",["watch","html","sass","images","js"],function(){
//     gulp.start("watch","html","sass","images","js")
// })