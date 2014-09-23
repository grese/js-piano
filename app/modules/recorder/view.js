define(function(require, exports, module) {
    "use strict";

    var app = require("app"),
        Player = require('./player'),
        Recorder = require('./recorder'),
        Modal = require('../modal/index'),
        ModalModel = Modal.Model,
        SongModel = require('../song/model'),
        SpinnerButton = require('../../components/spinner-button/index').Views.Default;

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
            this.on('saveSong', this.saveSong);
            this.on('recordingOn', this.render);
            this.on('recordingOff', this.render);
        },
        hasUnsavedChanges: function(){
            return (this.recorder.hasRecordedData() ||
                this.song.get('name') !== 'Untitled');
        },
        saveInProgress: false,
        serialize: function(){
            return {
                recordingClass: this.recorder.recording ? 'record-active' : '',
                newDisabled: !this.settings.get('listenMode') && !this.hasUnsavedChanges(),
                song: this.song,
                listenMode: this.settings.get('listenMode')
            };
        },
        afterRender: function(){
            this.$el.addClass('recorder-view');
            this.$recordBtn = $('#recorder-record-btn');
            this.$progressBar = $('#recorder-progress-bar');
            this.$songNameInput = $('#song-name-input');
            this.saveButton = new SpinnerButton({
                el: this.$el.find('.save-button-container'),
                hasText: false,
                hasIcon: true,
                spinning: this.saveInProgress,
                buttonId: 'recorder-save-btn',
                buttonTitle: 'Save Changes',
                size: 'sm',
                disabled: !this.hasUnsavedChanges(),
                buttonClass: 'recorder-save-btn recorder-controls-btn has-tooltip',
                buttonIcon: 'fa fa-save',
                clickEvent: 'saveClicked'
            });
            this.saveButton.render();
            var self = this;
            this.saveButton.on('saveClicked', function(){
                self.savePushed();
            });
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
                this.recorder.stopRecording();
                this.trigger('recordingOff');
            }else{
                this.recorder.startRecording();
                this.trigger('recordingOn');
            }
        },
        updatePlaybackProgress: function(total, current){
            var percent = (current / total) * 100;
            this.$progressBar.css('width', percent+'%');
        },
        saveSong: function(){
            this.saveInProgress = true;
            this.saveButton.trigger('startSpinning');
            if(app.router.modal.model.get('visible')) app.router.modal.destroyModal();

            var self = this;
            this.song.save().then(function(result){
                if(result.errors && result.errors.length > 0){
                    var serverErrs = '<ul><li>' + result.errors.join('</li><li>') + '</li></ul>';
                    app.router.renderAlert({
                        type: 'danger',
                        alertTitle: 'Oops! ',
                        alertMessage: ' A problem occurred while saving your song to the server. '+serverErrs
                    });
                }else{
                    app.router.renderAlert({
                        type: 'success',
                        alertTitle: 'Success! ',
                        alertMessage: ' Your song was saved successfully!'
                    });
                    app.router.songs.fetch().then(function(){
                        if(result.song){
                            var id = result.song._id;
                            if(id){
                                app.router.navigate('/'+id, {trigger: true});
                            }
                        }
                    });
                }
                self.saveInProgress = false;
                self.saveButton.trigger('stopSpinning');
            });
        },
        savePushed: function(){
            if(this.hasUnsavedChanges()){
                this.song.set('events', this.recorder.events);
                this.song.set('duration', this.recorder.duration);
                this.song.set('date', moment().format());
                var mm = new ModalModel({
                    title: 'Save?',
                    body: '<p>You are about to save the song that you have been working on.  ' +
                        'Once you save this song, you will not be able to go back and edit it.  ' +
                        'Are you sure you are ready to save?</p>',
                    visible: true,
                    actionTarget: this,
                    okAction: 'saveSong'
                });
                app.router.modal.model = mm;
                app.router.modal.render();
            }
        },

        newSongPushed: function(){
            if(!this.settings.get('listenMode') && this.hasUnsavedChanges()){
                var mm = new ModalModel({
                    title: 'Unsaved Changes',
                    body: '<p>The recorder currently has unsaved changes.  If you choose to create ' +
                        'a new song without saving, your changes will be lost.  Click \'Ok\' to continue, or ' +
                        '\'Close\' to continue working on the current song.</p>',
                    visible: true,
                    actionTarget: this,
                    okAction: 'createSong'
                });
                app.router.modal.model = mm;
                app.router.modal.render();
            }else{
                this.createSong();
            }
        },
        createSong: function(){
            if(app.router.modal.model.get('visible')) app.router.modal.destroyModal();
            this.recorder.reset();
            this.song = app.router.song = new SongModel();
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