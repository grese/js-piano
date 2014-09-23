define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var AlertModel = Backbone.Model.extend({
        defaults: {
            title: '',
            message: '',
            type: 'info',
            visible: false,
            dismissable: true
        }
    });

    module.exports = ModalModel;
});