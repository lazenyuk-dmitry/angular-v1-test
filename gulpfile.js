const gulp = require("gulp");
const path = require("path");
const browserSync = require('browser-sync').create();

const DIRS = {
  DIST: "./dist/",
  STYLE: [
    "./src/less/style.less",
    "./src/js/**/*.less",
  ],
  VENDOR: [
    path.join(path.dirname(require.resolve("angular")), "angular.js"),
  ],
  TEMPLATES: "./src/js/**/*.tpl.html",
  MAIN: "./src/js/**/*.js",
  INDEX: "./src/index.html",
  ASSETS: "./src/assets/**/*",
};

gulp.task('server', () => {
    browserSync.init({
        server: {
            baseDir: DIRS.DIST,
        }
    });
});

gulp.task("clean", () =>
  gulp.src("./dist", { read: false, allowEmpty: true, })
    .pipe(require("gulp-clean")())
);

gulp.task("vendor", () =>
  gulp.src(DIRS.VENDOR)
    .pipe(require("gulp-concat")("vendor.js"))
    .pipe(gulp.dest("./dist/js/"))
);

gulp.task("templates", () =>
  gulp.src(DIRS.TEMPLATES)
    .pipe(require("gulp-ng-html2js")({
      moduleName: "templates",
      prefix: "./js/",
    }))
    .pipe(require("gulp-concat")("templates.js"))
    .pipe(gulp.dest("./dist/js/"))
);

gulp.task("main", () =>
  gulp.src(DIRS.MAIN)
    .pipe(require("gulp-concat")("main.js"))
    .pipe(gulp.dest("./dist/js/"))
);

gulp.task("style", () =>
  gulp.src(DIRS.STYLE)
    .pipe(require("gulp-less")({
      paths: [
        path.join(__dirname, "src", "less"),
      ],
    }))
    .pipe(require("gulp-concat")("style.css"))
    .pipe(gulp.dest("./dist/style/"))
);

gulp.task("index", () =>
  gulp.src(DIRS.INDEX)
    .pipe(gulp.dest("./dist/"))
);

gulp.task("assets", () =>
  gulp.src(DIRS.ASSETS)
    .pipe(gulp.dest("./dist/assets/"))
);

gulp.task('watch', () => {
  gulp.watch(DIRS.STYLE, gulp.series('style')).on('change', browserSync.reload);
  gulp.watch(DIRS.VENDOR, gulp.series('vendor')).on('change', browserSync.reload);
  gulp.watch(DIRS.TEMPLATES, gulp.series('templates')).on('change', browserSync.reload);
  gulp.watch(DIRS.MAIN, gulp.series('main')).on('change', browserSync.reload);
  gulp.watch(DIRS.INDEX, gulp.series('index')).on('change', browserSync.reload);
  gulp.watch(DIRS.ASSETS, gulp.series('assets')).on('change', browserSync.reload);
});

gulp.task("default", gulp.series(
  "clean",
  gulp.parallel(
    "vendor",
    "templates",
    "main",
    "style",
    "index",
    "assets",
  ),
));

gulp.task("build", gulp.series("default"));
gulp.task("dev", gulp.series("default", gulp.parallel("watch", "server")));
