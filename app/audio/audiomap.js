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
        recorderOn: false,
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
        loadAudioSprite: function(instrument){
            // Load the audio sprite for the current instrument.
            var self = this,
                audioSprite = '/app/audio/'+instrument+'/output.'+this.format,
                spriteJson = '/app/audio/'+instrument+'/output.json';

            // Get SpriteMap JSON for the selected instrument...
            $.getJSON(spriteJson).then(function(map){
                console.log('loaded');
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
    };

    var initialize = function(instrument){
        _.extend(this, AudioMap);
        if(!instrument) instrument = this.defaultInstrument;
        this.loadAudioSprite(instrument);
    };

    module.exports = initialize;
});