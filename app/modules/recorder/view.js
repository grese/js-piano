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
        instrument: null,
        initialize: function(){
            if(!this.song){
                // If a song was not found, we need to transition back to / to create a new one.
                app.router.navigate('/', {trigger: true});
            }else{
                this.listenTo(this.song, 'change', this.render);
            }
            this.recorder = Recorder;
            this.player = new Player(this.song.get('instrument'));
            this.player.recorder = this.recorder;
            this.listenTo(this.player, 'playbackProgress', this.updatePlaybackProgress);
            this.listenTo(this.settings, 'change', this.render);
            this.listenTo(this.song, 'change', this.render);
            this.on('createSong', this.createSong);
        },
        hasUnsavedChanges: function(){
            return !this.listenMode &&
                (this.recorder.events.length > 0 || this.song.get('name') !== 'Untitled');
        },
        serialize: function(){
            return {
                saveDisabled: this.hasUnsavedChanges(),
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
            "click #recorder-pause-btn": 'pausePressed',
            "click #recorder-play-btn": 'playPressed',
            "click #recorder-record-btn": 'toggleRecording',
            "click #recorder-stop-btn": 'stopPressed',
            "click #recorder-new-btn": 'newSongPushed',
            "mousedown #recorder-ff-btn": 'fwdPushed',
            "mouseup #recorder-ff-btn": 'fwdReleased',
            "mousedown #recorder-rew-btn": 'rewPushed',
            "mouseup #recorder-rew-btn": 'rewReleased',
            'change #song-name-input': 'songNameChanged'
        },
        songNameChanged: function(){
            this.song.set('name', this.$songNameInput.val());

        },
        toggleRecording: function(){
            if(this.recorder.recording){
                this.$recordBtn.removeClass('record-active');
                this.recorder.stopRecording();
                this.trigger('recordingOff');
            }else{
                this.$recordBtn.addClass('record-active');
                this.recorder.startRecording();
                this.trigger('recordingOn');
            }
            this.$recordBtn.focusout();
        },
        updatePlaybackProgress: function(total, current){
            var percent = (current / total) * 100;
            this.$progressBar.css('width', percent+'%');
        },
        newSongPushed: function(){
            if(this.hasUnsavedChanges()){
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
            }
        },
        createSong: function(){
            this.modal.destroyModal();
            //this.song = new SongModel();
            this.render();
            Backbone.history.navigate('', {trigger: true});
        },
        playPressed: function(){
            this.player.play();
        },
        stopPressed: function(){
            this.player.stop();
        },
        fwdPushed: function(){
            this.player.startFastForward();
        },
        rewPushed: function(){
            this.player.startRewind();
        },
        fwdReleased: function(){
            this.player.stopFastForward();
        },
        rewReleased: function(){
            this.player.stopRewind();
        },
        pausePressed: function(){
            this.player.pause();
        }
    });

    module.exports = Layout;
});