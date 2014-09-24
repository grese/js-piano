module.exports = ->
  @loadNpmTasks "grunt-contrib-copy"

  # Move bower_components and app logic during a build.
  @config "copy",
    release:
      files: [
        (src: "bower_components/**", dest: "dist/")
        (expand: true, cwd: "assets/", src: '**', dest: "dist/")
        (expand: true, cwd: "app/", src: 'audio/**', dest: "dist/app/")
      ]
