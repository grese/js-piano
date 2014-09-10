define(function(require, exports, module) {
    "use strict";

    var app = require("app"),
        ModalModel = require('../../modal/model'),
        SongModel = require('../../song/model');


    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        audio: null,
        instruments: ['piano'],
        settings: {
            oldsong: false,
            format: 'mp3',
            octaves: 2,
            instrument: 'piano',
            recording: false,
            maxOctaves: 2
        },
        recorder: {
            timer: null,
            duration: 0,
            events: []
        },
        playback: {
            state: 'stop',
            timer: null,
            playHead: 0,
            eventIdx: 0
        },
        soundEnd: 0,
        song: null,
        initialize: function() {
            var self = this;
            self.loadAudioSprite();
            if(this.song.get('name') !== 'untitled'){
                this.settings.oldsong = true;
            }
            this.listenTo(this.song, 'change', this.render);
        },
        afterRender: function(){
            this.setElements();
        },
        setElements: function(){
            this.$octaveInput = $('#kb-num-octaves');
            this.$recordBtn = $('#kb-record-btn');
            this.$progressBar = $('#kb-progress-bar');
            this.$songNameInput = $('#song-name-input');
        },
        playSound: function(sound){
            if (this.spritemap[sound]) {
                this.updateSoundTimes(this.spritemap[sound]);
                this.audio.play();
                if(this.settings.recording){
                    this.recordSound(sound);
                }
            }
        },
        recordSound: function(sound){
            this.recorder.events.push({
                instrument: this.settings.instrument,
                time: this.recorder.duration,
                sound: sound
            });
        },
        startRecord: function(){
            var self = this,
                duration = this.recorder.duration ? this.recorder.duration : 0;
            this.recorder.timer = setInterval(function(){
                self.recorder.duration = ++duration;
            }, 1);
        },
        stopRecord: function(){
            clearInterval(this.recorder.timer);
            this.render();
        },
        updateSoundTimes: function(sound){
            var self = this;
            this.audio.currentTime = sound.start;
            this.soundEnd = sound.end;
            this.audio.addEventListener('timeupdate', function() {
                if (self.audio.currentTime > self.soundEnd) {
                    self.audio.pause();
                }
            },false);
        },
        toggleRecording: function(){
            if(this.settings.recording){
                this.settings.recording = false;
                this.$recordBtn.removeClass('kb-record-active');
                this.stopRecord();
            }else{
                this.settings.recording = true;
                this.$recordBtn.addClass('kb-record-active');
                this.startRecord();
            }
            this.$recordBtn.focusout();
        },
        startPlayback: function(pos, eventIdx){
            var self = this;
            if(!this.settings.recording){
                var sound = null,
                    numSounds = self.recorder.events.length,
                    totalDuration = self.recorder.duration;

                if(typeof eventIdx === 'undefined'){
                    self.playback.eventIdx = 0;
                }
                if(typeof pos === 'undefined'){
                    self.playback.playHead = 0;
                }

                self.playback.timer = setInterval(function(){
                    ++self.playback.playHead;
                    if(self.playback.eventIdx < numSounds){
                        sound = self.recorder.events[self.playback.eventIdx];
                    }else{
                        clearInterval(self.playback.timer);
                        self.updatePlaybackProgress(totalDuration, totalDuration);
                        self.playback.state = 'stop';
                    }
                    if(sound && sound.time === self.playback.playHead){
                        self.playSound(sound.sound);
                        self.playback.eventIdx++;
                    }else if(sound && sound.time < self.playback.playHead){
                        self.playback.eventIdx++;
                    }
                    if(self.playback.playHead % 10 === 0)
                        self.updatePlaybackProgress(totalDuration, self.playback.playHead);
                }, 1);
            }
        },
        stopPlayback: function(){
            clearInterval(this.playback.timer);
            this.playback.playHead = 0;
            this.playback.eventIdx = 0;
            this.playback.state = 'stop';
            this.updatePlaybackProgress(1,0);
        },
        pausePlayback: function(){
            clearInterval(this.playback.timer);
            this.playback.state = 'pause';
        },
        updatePlaybackProgress: function(total, current){
            var percent = (current / total) * 100;
            this.$progressBar.css('width', percent+'%');
        },
        loadAudioSprite: function(){
            var self = this,
                format = this.settings.format,
                instrument = this.settings.instrument ? this.settings.instrument : this.instruments[0],
                audioSprite = '/app/audio/'+instrument+'/output.'+format,
                spriteJson = '/app/audio/'+instrument+'/output.json';
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
        },

        serialize: function() {
            var octaveList = [];
            for(var i=0; i<this.settings.octaves; i++){
                octaveList.push(i+1);
            }
            return {
                song: this.song,
                settings: this.settings,
                notes: this.notes,
                recorder: this.recorder,
                octaveList: octaveList
            };
        },
        notes: ['c', 'cs', 'd', 'ds', 'e', 'f', 'fs', 'g', 'gs', 'a', 'as', 'b'],
        events: {
            "click .kb-key": 'playTone',
            "click #kb-pause-btn": 'pausePlayback',
            "click #kb-play-btn": 'playPressed',
            "click #kb-record-btn": 'toggleRecording',
            "click #kb-num-octaves": 'octavesChanged',
            "click #kb-stop-btn": 'stopPlayback',
            "click #kb-new-btn": 'newSongPushed',
            "change #song-name-input": 'songNameChanged',
            "mousedown #kb-ff-btn": 'fwdPushed',
            "mouseup #kb-ff-btn": 'fwdReleased',
            "mousedown #kb-rew-btn": 'rewPushed',
            "mouseup #kb-rew-btn": 'rewReleased'
        },
        songNameChanged: function(){
            this.song.set('name', this.$songNameInput.val());
            this.render();
        },
        newSongPushed: function(){
            if(this.recorder.events.length > 0 || this.song.get('name') !== 'untitled'){
                var mm = new ModalModel({
                    title: 'Unsaved Changes',
                    body: '<p>The recorder currently has unsaved changes.  If you choose to create ' +
                        'a new song without saving, your changes will be lost.  Click \'Ok\' to continue, or ' +
                        '\'Close\' to continue working on the current song.</p>',
                    size: 'small',
                    visible: true,
                    dismissable: true,
                    hasFooter: true,
                    hasCloseButton: true,
                    closeButtonText: 'Close',
                    actionTarget: this,
                    okAction: 'createSong',
                    footerButtons: [
                        {
                            text: 'Ok',
                            action: 'okAction',
                            on: 'click'
                        }
                    ]
                });
                this.on('createSong', this.createSong);
                this.modal.model = mm;
                this.modal.render();
            }
        },
        createSong: function(){
            this.modal.destroyModal();
            this.song = new SongModel();
            this.render();
            Backbone.history.navigate('', {trigger: true});
        },
        playPressed: function(){
            if(this.playback.state !== 'pause'){
                this.updatePlaybackProgress(1, 0);
                var self = this;
                setTimeout(function(){
                    self.startPlayback();
                }, 1000);
            }else{
                this.startPlayback(this.playback.playHead, this.playback.eventIdx);
            }
        },
        advancePlayer: function(){
            var self = this,
                interval = setInterval(function(){
                if(self.playback.state !== 'fwd'){
                    clearInterval(interval);
                    return;
                }else{
                    var numEvts = self.recorder.events.length,
                        evt = self.recorder.events[self.playback.eventIdx];

                    if(evt){
                        if(self.playback.playHead >= evt.time){
                            if(numEvts > self.playback.eventIdx){
                                ++self.playback.eventIdx;
                            }
                        }
                        if(self.playback.playHead < self.recorder.duration){
                            ++self.playback.playHead;
                            self.updatePlaybackProgress(self.recorder.duration, self.playback.playHead);
                        }else{
                            self.playback.playHead = self.recorder.duration;
                            self.updatePlaybackProgress(self.recorder.duration, self.recorder.duration);
                        }
                    }
                }
            }, 1);
        },
        rewindPlayer: function(){
            var self = this;
            self.playback.timer = setInterval(function() {
                    var evt;
                    if (self.playback.state !== 'rew') {
                        clearInterval(self.playback.timer);
                        return;
                    } else {
                        evt = self.recorder.events[self.playback.eventIdx];
                        if (evt) {
                            if (self.playback.playHead > 0) {
                                --self.playback.playHead;
                                self.updatePlaybackProgress(self.recorder.duration, self.playback.playHead);
                            } else {
                                self.playback.playHead = 0;
                                self.updatePlaybackProgress(1, 0);
                            }
                            if ((self.playback.eventIdx > 0) && (self.playback.playHead < evt.time)) {
                                var nextEvt = self.recorder.events[self.playback.eventIdx-1];
                                if(nextEvt.time < self.playback.playHead){
                                    --self.playback.eventIdx;
                                }
                            }
                        }
                    }
                }, 1);
        },
        fwdPushed: function(){
            this.playback.state = 'fwd';
            this.advancePlayer();
        },
        rewPushed: function(){
            this.playback.state = 'rew';
            this.rewindPlayer();
        },
        fwdReleased: function(){
            this.playback.state = 'pause';
        },
        rewReleased: function(){
            this.playback.state = 'pause';
        },
        octavesChanged: function(){
            this.settings.octaves = this.$octaveInput.val();
            this.render();
        },
        playTone: function(t){
            var note = $(t.currentTarget).data('note'),
                oct = $(t.currentTarget).data('octave'),
                key = note+oct;
            this.playSound(key);
        }
    });

    module.exports = Layout;
});