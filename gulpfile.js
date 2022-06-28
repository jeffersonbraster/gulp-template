const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");

// Compilando sass, adicionando prefixos e refresh na pagina
function compileSass() {
  return gulp
    .src("sass/*.scss")
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("css/"))
    .pipe(browserSync.stream());
}

//executando tarefa do sass
gulp.task("sass", compileSass);

function pluginsCSS() {
  return gulp
    .src("css/lib/*.css")
    .pipe(concat("plugins.css"))
    .pipe(gulp.dest("css/"))
    .pipe(browserSync.stream());
}

gulp.task("plugincss", pluginsCSS);

//compilando js, utilizando o babel para converter o js para todos os nav e fazendo concat dos arquivos em um unico arquivo
function gulpJs() {
  return gulp
    .src("js/scripts/*.js")
    .pipe(concat("all.js"))
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("js/"))
    .pipe(browserSync.stream());
}

//executando tarefa do gulpJs
gulp.task("allJs", gulpJs);

function pluginsJs() {
  return gulp
    .src(["./js/lib/swiper.min.js"])
    .pipe(concat("plugins.js"))
    .pipe(gulp.dest("js/"))
    .pipe(browserSync.stream());
}

gulp.task("pluginjs", pluginsJs);

//função do browser sync
function browser() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

//executando o browser sync
gulp.task("browser-sync", browser);

//função do watch para alterações em html, scss e js
function watch() {
  gulp.watch("sass/*.scss", compileSass);
  gulp.watch("css/lib/*.css", pluginsCSS);

  gulp.watch("*.html").on("change", browserSync.reload);

  gulp.watch("js/scripts/*.js", gulpJs);

  gulp.watch("js/lib/*.js", pluginsJs);
}

//executando o watch
gulp.task("watch", watch);

//tarefas default que executa o watch e o browser sync paralelamente
gulp.task(
  "default",
  gulp.parallel(
    "watch",
    "browser-sync",
    "sass",
    "plugincss",
    "allJs",
    "pluginjs"
  )
);
