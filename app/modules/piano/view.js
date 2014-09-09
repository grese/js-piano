define(function(require, exports, module) {
    "use strict";

    var app = require("app"),
        PianoSettings = require('./models/settings');

    var Layout = Backbone.Layout.extend({
        settings: null,
        recorder: null,
        audio: null,
        spritemap: null,
        template: require("ldtpl!./template"),
        instruments: ['piano'],
        formats: ['mp3', 'm4a', 'ogg'],
        notes: ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b'],
        events: {
            'change #piano-num-octaves': 'numOctavesChanged',
            'click .piano-key': 'keyPressed'
        },
        noteEnd: 0,
        initialize: function() {
            if(this.settings === null){
                this.settings = new PianoSettings();
            }
            this.loadAudioSprite();
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
            this.playNote(noteKey);
        },
        playNote: function(sound){
            if (this.spritemap[sound]) {
                this.findNoteFromSprite(this.spritemap[sound]);
                this.audio.play();
            }
        },
        findNoteFromSprite: function(sound){
            var self = this;
            this.audio.currentTime = sound.start;
            this.noteEnd = sound.end;
            this.audio.addEventListener('timeupdate', function() {
                if (self.audio.currentTime > self.noteEnd) {
                    self.audio.pause();
                }
            },false);
        },
        loadAudioSprite: function(){
            // Load the audio sprite for the current instrument.
            var self = this,
                format = this.settings.get('format'),
                instrument = this.settings.get('instrument') ?
                    this.settings.get('instrument') : this.instruments[0],
                audioSprite = '/app/audio/'+instrument+'/output.'+format,
                spriteJson = '/app/audio/'+instrument+'/output.json';

            // Get SpriteMap JSON for the selected instrument...
            $.getJSON(spriteJson).then(function(map){
                if(map.spritemap){
                    self.spritemap = map.spritemap;
                    self.audio = new Audio(audioSprite);
                    self.audio.play();
                    self.audio.pause();
                }else{
                    self.spritemap = null;
                }
            });
        }
    });

    module.exports = Layout;
});