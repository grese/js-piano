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
            this.listenTo(this.model, "change", this.render);
        },
        events: {
            'click a.song-name': 'clickedSong'
        },
        clickedSong: function(e){
            e.preventDefault();
            var songname = $(e.currentTarget).data('songname');
            app.router.navigate(songname, {trigger: true});
        }
    });
    module.exports = Layout;
});