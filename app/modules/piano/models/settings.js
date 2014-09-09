define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var PianoSettings = Backbone.Model.extend({
        defaults: {
            maxOctaves: 2,
            octaves: 2
        }
    });

    module.exports = PianoSettings;
});