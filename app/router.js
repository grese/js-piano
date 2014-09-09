define(function(require, exports, module) {
  "use strict";


  // External dependencies.
  require("bootstrap");
  var Backbone = require("backbone"),
      Nav = require('modules/nav/index'),
      Footer = require('modules/footer/index'),
      Song = require('modules/song/index'),
      Piano = require('modules/piano/index');

  // Defining the application router.
  var Router = Backbone.Router.extend({
      initialize: function(){
          this.songs = new Song.Collection();
      },
      routes: {
        "": "index",
        ":name": "index"
      },

    index: function(song) {
        var Layout = Backbone.Layout.extend({
            el: 'main',
            template: require('ldtpl!./templates/main'),
            views: {
                ".nav-container": new Nav.Views.Nav({}),
                ".footer-container": new Footer.Views.Footer({}),
                ".songs-container": new Song.Views.List({collection: this.songs}),
                ".piano-container": new Piano.Views.Piano()
            }
        });
        new Layout().render();
    }
  });

  module.exports = Router;
});
