define(function(require, exports, module) {
  "use strict";


  // External dependencies.
  require("bootstrap");
  var Backbone = require("backbone"),
      Nav = require('modules/nav/index'),
      Footer = require('modules/footer/index'),
      Song = require('modules/song/index'),
      Piano = require('modules/piano/index'),
      Recorder = require('modules/recorder/index'),
      Modal = require('modules/modal/index'),
      AudioMap = require('audio/audiomap');

  // Defining the application router.
  var Router = Backbone.Router.extend({
      initialize: function(){
          var self = this;
          this.songs = new Song.Collection();
          this.songsView = new Song.Views.List({collection: this.songs});
          this.songs.fetch().then(function(songs){
              self.songs = new Song.Collection(songs);
          });
          this.recorderSettings = new Recorder.SettingsModel();
          this.modalView = new Modal.Views.Modal();
      },
      routes: {
        "": "index",
        ":songname": "index"
      },

    index: function(songid) {
        var song = null;
        if(songid){
            // Recorder will go into 'listen mode' if we are loading a previously recorded song...
            song = this.songs.get(songid);
            this.recorderSettings.set('listenMode', true);
        }else{
            song = new Song.Model();
            this.recorderSettings.set('listenMode', false);
        }

        this.recorderView = new Recorder.Views.Recorder({
            song: song,
            settings: this.recorderSettings,
            modal: this.modalView
        });
        this.pianoView = new Piano.Views.Piano();

        var Layout = Backbone.Layout.extend({
            el: 'main',
            template: require('ldtpl!./templates/main'),
            views: {
                '.nav-container': new Nav.Views.Nav(),
                '.footer-container': new Footer.Views.Footer(),
                '.songs-container': this.songsView,
                '.piano-container': this.pianoView,
                '.recorder-container': this.recorderView,
                '.modal-container': this.modalView
            },
            afterRender: function(){
                $('.has-tooltip').tooltip();
            }
        });
        new Layout().render();
    }
  });

  module.exports = Router;
});
