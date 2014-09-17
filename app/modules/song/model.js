define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var Song = Backbone.Model.extend({
        idAttribute: '_id',
        defaults: {
            instrument: 'piano',
            name: 'Untitled',
            duration: 0,
            events: [],
            date: null
        },
        urlRoot: 'songs',
        url: function(){
            return app.apiroot + this.urlRoot;
        }
    });

    module.exports = Song;
});