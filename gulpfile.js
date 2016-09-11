var 
	gulp   = require('gulp'),
	del    = require('del'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	less   = require('gulp-less'),
	cssmin = require('gulp-cssmin'),
	prefix = require('gulp-autoprefixer'),
	jsmin  = require('gulp-jsmin'),
	imgmin = require('gulp-imagemin'),
	juicer = require('gulp-juicer-js'),
	server = require('gulp-devserver'),
	essi   = require('essi'),
	yargs  = require('yargs').argv,
	htmlmin = require('gulp-htmlmin'),
  Path = require('path');
  plumber = require('gulp-plumber'),
  rev = require('gulp-rev');


cdnPath = {  
    online: '//loumingjie.cn/crm/build'
  };

/**
 * 清除bulid目录
 */
gulp.task('clean', function() {
	console.log('test');
    del(['build']);
});

/**
 * CSS任务,less,加前缀,压缩
 */
gulp.task('css', function() {

    gulp.src(['src/**/*.css','src/**/*.less'])
      .pipe(plumber())
      .pipe(less())
      .pipe(prefix())
      .pipe(cssmin())
      .pipe(rename(function( path ){
      	path.extname = '.css';
      }))
      .pipe(gulp.dest('build/'));
      console.log('css编译成功');
});

/**
 * js任务
 */
gulp.task('js', function() {
	gulp.src(['src/**/*.js','!src/**/*.min.js','!src/**/sea.js'])
	  .pipe(uglify())
    // .pipe(rev())
    // .pipe(rev.manifest())
	  .pipe(gulp.dest('build/'));    
	  console.log('js编译成功');
  gulp.src('src/**/sea.js')
  .pipe(gulp.dest('build/'));  
});

 /**
  * html 压缩
  */
gulp.task('html', function() {
    gulp.src('src/**/*.html')
      .pipe(essi.gulp({
        strictPate:true,
        cdnPath: cdnPath.online
      }))
      .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
      }))
      .pipe(gulp.dest('build/'));
      console.log('html编译成功');
});

/*
* juicer编译
*
* `gulp juicer` 编译./src目录下的所有juier模板
* `gulp juicer -c --cwd .` 编译命令行当前目录下的juicer模板
*/
gulp.task('juicer', function () {
  var srcRoot = srcDir = Path.resolve(__dirname, './src');
  var buildRoot = buildDir = Path.resolve(__dirname, './build');

  if(yargs.c) {
    srcDir = process.cwd();
    buildDir = srcDir.replace(srcRoot, buildRoot);
  }
  gulp.src(srcDir + '/**/*.juicer')
    .pipe(juicer({cmd:true, juicerPath:''}))
    .pipe(rename(function ( path ) {
      path.basename += 'Tpl';
      path.extname = '.js';
    }))
    .pipe(gulp.dest(srcDir))
    .pipe(gulp.dest(buildDir));

  console.log('Juicer编译成功');
});

gulp.task('watch', function () {
  gulp.watch(['./src/**/*.juicer'], ['juicer']);
});


gulp.task('release',['clean', 'css', 'js', 'html', 'copy', 'juicer']);

gulp.task('copy', function(){
	gulp.src(['src/**/*.eot','src/**/*.svg','src/**/*.ttf','src/**/*.woff','src/**/*.png','src/**/*.htc'])
	.pipe(gulp.dest('build/'));
})

/**
 * 参数说明
 * -w: 实时监听
 * -s: 启动服务器
 */
gulp.task('default', function () {
  if ( yargs.s ) {
    gulp.start('server');
  }
  if ( yargs.w ) {
    gulp.start('watch');
  }
  if ( yargs.c ) {
    gulp.start('clean');
  }
  else {
    gulp.start('release');
  }
});

