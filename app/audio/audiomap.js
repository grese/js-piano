define(function(require, exports, module) {
    "use strict";
    var AudioMap = {
        defaultInstrument: 'piano',
        instruments: ['piano'],
        formats: ['mp3', 'm4a', 'ogg'],
        format: 'mp3',
        notes: ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b'],
        spritemap: null,
        noteEnd: 0,
        ready: false,
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
            },true);
        },
        spriteLoaded: function(){
            /* spriteLoaded() is called from the context of the audio element, so 'this'
               refers to that particular audio element.  targetObject points to this instance
               of the AudioMap class. */
            this.targetObject.audioReady();
            this.targetObject = null;
        },
        audioReady: function(){
            this.audio.removeEventListener('canplaythrough', this.spriteLoaded, false);
            if(!this.ready){
                this.audio.play();
                this.audio.pause();
                this.ready = true;
                this.trigger('ready');
            }
        },
        loadAudioSprite: function(instrument, name){
            // Load the audio sprite for the current instrument.
            var self = this,
                audioSprite = '/app/audio/'+instrument+'/output.'+this.format,
                spriteJson = '/app/audio/'+instrument+'/output.json';
            // Get SpriteMap JSON for the selected instrument...
            $.getJSON(spriteJson).then(function(map){
                if(map.spritemap){
                    self.spritemap = map.spritemap;
                    self.audio = document.createElement('audio');
                    self.audio.id = 'audio-'+name;
                    self.audio.src = audioSprite;
                    self.audio.targetObject = self;
                    self.audio.addEventListener('canplaythrough', self.spriteLoaded, false);
                }else{
                    self.spritemap = null;
                }
            });
        }
    };

    var initialize = function(instrument, name){
        if(!instrument) instrument = this.defaultInstrument;
        if(!name) name = Date.now();
        _.extend(this, AudioMap, Backbone.Events);
        this.loadAudioSprite(instrument, name);
    };

    module.exports = initialize;
});