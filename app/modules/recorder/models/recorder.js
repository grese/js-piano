define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var RecorderModel = Backbone.Model.extend({
        defaults: {
            timer: null,
            duration: 0,
            events: []
        }
    });

    module.exports = RecorderModel;
});