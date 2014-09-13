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
          var s1 = new Song.Model({
              name: 'herecomesthesun',
              duration: '3:20',
              events: []
          });
          var s2 = new Song.Model({
              name: 'LaLaLa',
              duration: '3:33',
              events: []
          });
          this.songs = new Song.Collection([s1, s2]);
          this.recorderSettings = new Recorder.SettingsModel();
          this.modalView = new Modal.Views.Modal();
      },
      routes: {
        "": "index",
        ":songname": "index"
      },

    index: function(songname) {
        var song = null;
        if(songname){
            // Recorder will go into 'listen mode' if we are loading a previously recorded song...
            song = this.songs.findWhere({name: songname});
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
                '.songs-container': new Song.Views.List({collection: this.songs}),
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
