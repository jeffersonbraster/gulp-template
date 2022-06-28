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
  gulp.watch("*.html").on("change", browserSync.reload);

  gulp.watch("js/scripts/*.js", gulpJs);
}

//executando o watch
gulp.task("watch", watch);

//tarefas default que executa o watch e o browser sync paralelamente
gulp.task("default", gulp.parallel("watch", "browser-sync", "sass", "allJs"));
