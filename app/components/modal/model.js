define(function(require, exports, module) {
    "use strict";
    var app = require("app");

    var ModalModel = Backbone.Model.extend({
        defaults: {
            title: 'Modal Title',
            body: '',
            size: 'medium',
            visible: false,
            dismissable: true,
            hasFooter: true,
            hasCloseButton: true,
            closeButtonText: 'Close',
            actionTarget: null,
            okAction: null,
            footerButtons: [
                {
                    text: 'Ok',
                    action: 'okAction',
                    on: 'click'
                }
            ]
        }
    });

    module.exports = ModalModel;
});