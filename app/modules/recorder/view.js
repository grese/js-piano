define(function(require, exports, module) {
    "use strict";

    var app = require("app");;

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        afterRender: function(){
            this.$el.addClass('recorder-view')
        }
    });

    module.exports = Layout;
});