const fs = require('fs'),
    gulp = require('gulp'),
    bump = require('gulp-bump'),
    git = require('gulp-git'),
    gulpSequence = require('gulp-sequence'),
    semver = require('semver'),
    argv = require('yargs')

gulp.task('bump', () => {
    const type = argv.major
            ? 'major'
            : argv.minor
                ? 'minor'
                : argv.patch
                    ? 'patch'
                    : argv.prerelease
                        ? 'prerelease'
                        : 'patch',
        packageJSON = JSON.parse(fs.readFileSync('./package.json', 'utf8')),
        newVersion = semver.inc(packageJSON.version, type)
    return gulp.src('./package.json')
        .pipe(bump({
            type,
        }))
        .pipe(gulp.dest('./'))
        .pipe(git.add())
        .pipe(git.commit(`Version bumped to ${newVersion}`))
})

gulp.task('release', gulpSequence('bump'))
