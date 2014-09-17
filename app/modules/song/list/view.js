define(function(require, exports, module) {
    "use strict";

    var app = require("app"),
        Item = require("../item/view");

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
        initialize: function() {
            this.listenTo(this.collection, "add", this.render);
            this.listenTo(this.collection, "remove", this.render);
        }
    });

    module.exports = Layout;
});