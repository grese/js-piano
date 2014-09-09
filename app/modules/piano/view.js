define(function(require, exports, module) {
    "use strict";

    var app = require("app"),
        PianoSettings = require('./models/settings');

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        initialize: function() {
            if(this.settings === null){
                this.settings = new PianoSettings();
            }
            this.listenTo(this.settings, 'change', this.render);
        },
        afterRender: function(){
            this.$el.addClass('piano-view-container');
            this.$numOctavesInput = $('#piano-num-octaves');
        },
        settings: null,
        serialize: function() {
            var octaves = [];
            for(var i=0; i<this.settings.get('octaves'); i++){
                octaves.push(i+1);
            }
            return {
                octaveList: octaves,
                settings: this.settings
            };
        },
        numOctavesChanged: function(){
            this.settings.set('octaves', this.$numOctavesInput.val());
        },
        events: {
            'change #piano-num-octaves': 'numOctavesChanged'
        }
    });

    module.exports = Layout;
});