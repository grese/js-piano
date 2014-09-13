define(function(require, exports, module) {
    "use strict";

    var app = require("app"),
        PianoSettings = require('./models/settings'),
        AudioMap = require('../../audio/audiomap');

    var Layout = Backbone.Layout.extend({
        settings: null,
        recorder: null,
        audio: null,
        template: require("ldtpl!./template"),
        events: {
            'change #piano-num-octaves': 'numOctavesChanged',
            'click .piano-key': 'keyPressed'
        },
        initialize: function() {
            var self = this;
            if(this.settings === null){
                this.settings = new PianoSettings();
            }
            this.audio = new AudioMap(this.settings.get('instrument'), 'piano');
            app.router.recorderView.on('recordingOff', function(){
                self.recorderOn = false;
            });
            app.router.recorderView.on('recordingOn', function(){
                self.recorderOn = true;
            });
            this.listenTo(this.settings, 'change', this.render);
        },
        afterRender: function(){
            this.$el.addClass('piano-view-container');
            this.$numOctavesInput = $('#piano-num-octaves');
        },
        serialize: function() {
            var octaves = [];
            for(var i=0; i<this.settings.get('octaves'); i++){
                octaves.push(i+1);
            }
            return {
                octaveList: octaves,
                settings: this.settings
            };
        },
        numOctavesChanged: function(){
            this.settings.set('octaves', this.$numOctavesInput.val());
        },
        keyPressed: function(t){
            var note = $(t.currentTarget).data('note'),
                oct = $(t.currentTarget).data('octave'),
                noteKey = note+oct;
            this.audio.playNote(noteKey);
            if(this.recorderOn){
                app.router.recorderView.recorder.recordEvent(
                    noteKey,
                    this.settings.get('instrument')
                );
            }
        }
    });

    module.exports = Layout;
});