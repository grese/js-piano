define(function(require, exports, module) {
    "use strict";

    var app = require("app"),
        ModalModel = require('../../modal/model');

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        tagName: "div",
        downloadFormat: 'mp3',
        serialize: function() {
            var filename = this.model.id + '.' + this.downloadFormat;
            return {
                model: this.model,
                duration: this.msToMinAndSec(this.model.get('duration')),
                songFile: '/audio/songs/'+filename,
                downloadFile: filename
            };
        },
        msToMinAndSec: function(millis){
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        },
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
            this.on('goToSong', this.goToSong);
        },
        afterRender: function(){
            this.$el.addClass('list-group-item');
        },
        events: {
            'click a.song-name': 'clickedSong'
        },
        clickedSong: function(e){
            e.preventDefault();
            this.songname = $(e.currentTarget).data('songname');
            if(!app.router.recorderSettings.get('listenMode') &&
                app.router.recorderView.hasUnsavedChanges()){
                var mm = new ModalModel({
                    title: 'Unsaved Changes',
                    body: '<p>The recorder currently has unsaved changes.  If you choose to create ' +
                        'a new song without saving, your changes will be lost.  Click \'Ok\' to continue, or ' +
                        '\'Close\' to continue working on the current song.</p>',
                    visible: true,
                    actionTarget: this,
                    okAction: 'goToSong'
                });
                app.router.modal.model = mm;
                app.router.modal.render();
            }else{
                this.goToSong(this.songname);
            }
        },
        goToSong: function(){
            app.router.modal.destroyModal();
            app.router.navigate(this.songname, {trigger: true});
        }
    });
    module.exports = Layout;
});