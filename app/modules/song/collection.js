define(function(require, exports, module) {
    "use strict";
    var app = require("app"),
        Song = require('./model');
    var Collection = Backbone.Collection.extend({
            model: Song,
            urlRoot: 'songs',
            url: function(){
                return app.apiroot + this.urlRoot;
            }
    });
    module.exports = Collection;
});