define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var Song = Backbone.Model.extend({
        defaults: {
            name: 'untitled',
            duration: 0,
            events: []
        },
        urlRoot: 'songs',
        url: function(){
            return app.apiroot + this.urlRoot + '/' + this.name;
        }
    });

    module.exports = Song;
});