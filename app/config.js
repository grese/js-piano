require.config({
  paths: {
    "underscore": "../bower_components/lodash/dist/lodash.underscore",
    "lodash": "../bower_components/lodash/dist/lodash",
    "ldtpl": "../bower_components/lodash-template-loader/loader",
    "jquery": "../bower_components/jquery/dist/jquery",
    "backbone": "../bower_components/backbone/backbone",
    "layoutmanager": "../bower_components/layoutmanager/backbone.layoutmanager",
    "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",
    "moment": "../bower_components/moment/moment"
  },
    deps: ['main'],
    shim: {
        "backbone": {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        "bootstrap": ['jquery']
    }

});
