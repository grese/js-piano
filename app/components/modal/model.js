define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var ModalModel = Backbone.Model.extend({
        defaults: {
            title: 'Modal Title',
            body: '',
            size: 'small',
            visible: false,
            dismissable: true,
            hasFooter: true,
            hasCloseButton: true,
            closeButtonText: 'Close',
            actionTarget: null,
            okAction: null,
            okButtonText: 'Ok',
            hasOkButton: true
        }
    });

    module.exports = ModalModel;
});