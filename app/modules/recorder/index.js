define(function(require, exports, module){
    "use strict";

    module.exports = {
        SettingsModel: require('./models/settings'),
        Views: {
            Recorder: require('./view')
        }
    };
});