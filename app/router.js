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
      Alert = require('components/alert/index'),
      AudioMap = require('audio/audiomap');

  // Defining the application router.
  var Router = Backbone.Router.extend({
      initialize: function(){
          var self = this;
          this.songs = new Song.Collection();
          this.songs.fetch();
          this.songsView = new Song.Views.List({collection: this.songs});
          this.recorderSettings = new Recorder.SettingsModel();
          this.modal = new Modal.Views.Modal();
          this.alertView = new Alert.Views.Default({
              active: false
          });
      },
      routes: {
        "": "index",
        ":songname": "index"
      },
      renderAlert: function(options){
          if(!options) options = {};
          for(var opt in options){
              this.alertView[opt] = options[opt];
          }
          this.alertView.active = true;
          this.alertView.render();
      },
    index: function(songid) {
        var self = this,
            song = null;
        if(songid) song = this.songs.get(songid);
        if(!song){
            song = new Song.Model();
            this.recorderSettings.set('listenMode', false);
        }else{
            this.recorderSettings.set('listenMode', true);
        }

        this.recorderView = new Recorder.Views.Recorder({
            song: song,
            settings: this.recorderSettings
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
                '.modal-container': this.modal,
                '.alert-container': this.alertView
            },
            afterRender: function(){
                $('.has-tooltip').tooltip();
                self.alertContainer = this.$el.find('alert-container').eq(0);
            }
        });
        new Layout().render();
    }
  });

  module.exports = Router;
});
