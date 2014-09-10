define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        tagName: "li",
        serialize: function() {
            return { model: this.model };
        },
        initialize: function() {
            console.log('INITIALIZE');
            this.listenTo(this.model, "change", this.render);
        },
        afterRender: function(){
            console.log($('.song-name'));
        },
        events: {
            'click .song-name': 'clickedSong'
        },
        clickedSong: function(e){
            console.log('CLICKED SONG');
            e.preventDefault();
            var song = $(e.currentTarget).data('songname');
            app.router.navigate(song);
        }
    });
    module.exports = Layout;
});