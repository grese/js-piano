define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        tagName: "li",
        serialize: function() {
            return { model: this.model };
        },
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        }
    });
    module.exports = Layout;
});