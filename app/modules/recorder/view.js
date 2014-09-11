define(function(require, exports, module) {
    "use strict";

    var app = require("app"),
        Player = require('./player'),
        Recorder = require('./recorder'),
        Modal = require('../modal/index'),
        ModalModel = Modal.Model,
        ModalView = Modal.Views.Modal;

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        player: null,
        recorder: null,
        initialize: function(){
            this.listenTo(this.settings, 'change', this.render);
            this.recorder = Recorder;
            this.player = Player;
            this.player.recorder = this.recorder;
            this.player.on('playbackProgress', this.updatePlaybackProgress);
            if(!this.song){
                // If a song was not found, we need to transition back to / to create a new one.
                app.router.navigate('/', {trigger: true});
            }else{
                this.listenTo(this.song, 'change', this.render);
            }
            this.on('createSong', this.createSong);
        },
        serialize: function(){
            return {
                song: this.song,
                listenMode: this.settings.get('listenMode')
            };
        },
        afterRender: function(){
            this.$el.addClass('recorder-view');
            this.$recordBtn = $('#recorder-record-btn');
            this.$progressBar = $('#recorder-progress-bar');
            this.$songNameInput = $('#song-name-input');

        },
        events: {
            "click #recorder-pause-btn": 'pausePlayback',
            "click #recorder-play-btn": 'playPressed',
            "click #recorder-record-btn": 'toggleRecording',
            "click #recorder-stop-btn": 'stopPlayback',
            "click #recorder-new-btn": 'newSongPushed',
            "mousedown #recorder-ff-btn": 'fwdPushed',
            "mouseup #recorder-ff-btn": 'fwdReleased',
            "mousedown #recorder-rew-btn": 'rewPushed',
            "mouseup #recorder-rew-btn": 'rewReleased'
        },
        toggleRecording: function(){
            if(this.recorder.recording){
                this.$recordBtn.removeClass('record-active');
                this.recorder.startRecording();
            }else{
                this.$recordBtn.removeClass('record-active');
                this.recorder.startRecording();
            }
            this.$recordBtn.focusout();
        },
        updatePlaybackProgress: function(total, current){
            var percent = (current / total) * 100;
            this.$progressBar.css('width', percent+'%');
        },

        newSongPushed: function(){
            if(this.recorder.events.length > 0 || this.song.get('name') !== 'untitled'){

            }
            var mm = new ModalModel({
                title: 'Unsaved Changes',
                body: '<p>The recorder currently has unsaved changes.  If you choose to create ' +
                    'a new song without saving, your changes will be lost.  Click \'Ok\' to continue, or ' +
                    '\'Close\' to continue working on the current song.</p>',
                visible: true,
                actionTarget: this,
                okAction: 'createSong'
            });
            this.modal.model = mm;
            this.modal.render();
        },
        createSong: function(){
            this.modal.destroyModal();
            //this.song = new SongModel();
            this.render();
            Backbone.history.navigate('', {trigger: true});
        },
        playPressed: function(){
            /*if(this.playback.state !== 'pause'){
                this.updatePlaybackProgress(1, 0);
                var self = this;
                setTimeout(function(){
                    self.startPlayback();
                }, 1000);
            }else{
                this.startPlayback(this.playback.playHead, this.playback.eventIdx);
            }*/
        },
        fwdPushed: function(){
            //this.playback.state = 'fwd';
            //this.advancePlayer();
        },
        rewPushed: function(){
            //this.playback.state = 'rew';
            //this.rewindPlayer();
        },
        fwdReleased: function(){
            //this.playback.state = 'pause';
        },
        rewReleased: function(){
            //this.playback.state = 'pause';
        }
    });

    module.exports = Layout;
});