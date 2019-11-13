var gulp = require("gulp"),
	sass = require("gulp-sass"),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	cssnano = require("cssnano"),
	sourcemaps = require("gulp-sourcemaps"),
	pug = require("gulp-pug"),
	data = require("gulp-data"),
	fs = require("fs"),
	browserSync = require("browser-sync").create();

var paths = {
	styles: {
		src: "design/scss/*.scss",
		dest: "design/css",
		all: "design/scss/**/*.scss"
	},
	html: {
		src: "design/pug/*.pug",
		dest: "design",
		all: "design/pug/**/*.pug"
	},
	json: "design/json/data.json"
};

function style() {
	return gulp
		.src(paths.styles.src)
		.pipe(sass())
		.on("error", sass.logError)
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.reload({ stream: true }));
}

function htmls() {
	return gulp
		.src(paths.html.src)
		.pipe(
			data(function() {
				return JSON.parse(fs.readFileSync(paths.json));
			})
		)
		.pipe(
			pug({
				locals: {},
				pretty: true
			})
		)
		.pipe(gulp.dest(paths.html.dest));
}

function reload(done) {
	browserSync.reload();
	done();
}

function watch() {
	browserSync.init({
		server: {
			baseDir: "./design"
		}
	});
	gulp.watch(paths.styles.all, style);
	gulp.watch(paths.html.all, htmls);
	gulp.watch("design/*.html", reload);
}

exports.watch = watch;
exports.style = style;
exports.htmls = htmls;

var build = gulp.parallel(htmls, style, watch);

gulp.task("default", build);
