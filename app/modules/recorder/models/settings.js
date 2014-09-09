define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var RecorderSettings = Backbone.Model.extend({
        defaults: {
            listenMode: false
        }
    });

    module.exports = RecorderSettings;
});