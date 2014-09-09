define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var PianoSettings = Backbone.Model.extend({
        defaults: {
            maxOctaves: 2,
            octaves: 2,
            instrument: 'piano',
            format: 'mp3'
        }
    });

    module.exports = PianoSettings;
});