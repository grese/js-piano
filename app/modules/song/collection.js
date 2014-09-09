define(function(require, exports, module) {
    "use strict";
    var app = require("app"),
        Song = require('./model');
    var Collection = Backbone.Collection.extend({
            model: Song
    });
    module.exports = Collection;
});