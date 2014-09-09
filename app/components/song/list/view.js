define(function(require, exports, module) {
    "use strict";

    var app = require("app"),
        Item = require("../item/view"),
        ModalModel = require("../../modal/model");

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),

        serialize: function() {
            return { songs: this.collection };
        },

        beforeRender: function() {
            this.collection.each(function(song) {
                this.insertView(".song-list", new Item({
                    model: song
                }));
            }, this);
        },
        songClicked: function(e){
            console.log('currentSong: ', this.currentSong);
            e.preventDefault();
            var $link = $(e.currentTarget),
                href = $link.attr('href').replace('/', '');
            this.renderModal(href);
        },
        renderModal: function(destinationHref){
            var mm = new ModalModel({
                title: 'Unsaved Changes?',
                body: '<p>You are about to load a previously recorded song.  If you have unsaved changes in the recorder, ' +
                    'those changes will be lost.  To continue, to load this song without saving, click \'Ok\' to continue.  To ' +
                    'continue working on the current song, click \'Close\'.</p>',
                size: 'small',
                visible: true,
                dismissable: true,
                hasFooter: true,
                hasCloseButton: true,
                closeButtonText: 'Close',
                actionTarget: this,
                okAction: 'loadSongEvent',
                footerButtons: [
                    {
                        text: 'Ok',
                        action: 'okAction'
                    }
                ]
            });
            this.modalOpen = false;
            this.modal.model = mm;
            this.modal.render();
            this.on('loadSongEvent', this.loadSong(destinationHref));
        },
        loadSong: function(href){
            var self = this;
            if(this.modalOpen){
                console.log('loading...');
            }else{
                var $ok = $('#modal-btn-0');
                $ok.off();
                $ok.on('click', function(){
                    console.log('navigating to: ', href);
                    self.modal.destroyModal();
                    Backbone.history.navigate(href, {trigger: true});
                });
                this.modalOpen = true;
            }
        },
        events: {
            'click a.song-name': 'songClicked',
            "click .ok-button": "loadSong"
        },
        initialize: function() {
            this.listenTo(this.collection, "change", this.render);
        }
    });

    module.exports = Layout;
});