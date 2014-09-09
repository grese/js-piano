define(function(require, exports, module) {
    "use strict";

    var ModalModel = require('./model');

    module.exports = {
        Model: ModalModel,
        Views: {
            Default: require("./view")
        }
    };
});