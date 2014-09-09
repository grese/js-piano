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
            hasOkButton: true,
            closeButtonText: 'Close',
            okButtonText: 'Ok',
            actionTarget: null,
            okAction: null,
            closeAction: null
        }
    });

    module.exports = ModalModel;
});