define(function(require, exports, module) {
    "use strict";

    module.exports = {
        Collection: require("./collection"),
        Model: require('./model'),
        Views: {
            Item: require("./item/view"),
            List: require("./list/view")
        }
    };
});