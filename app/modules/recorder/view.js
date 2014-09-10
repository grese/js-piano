define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        initialize: function(){
            this.listenTo(this.settings, 'change', this.render);
            if(!this.song){
                // If a song was not found, we need to transition back to / to create a new one.
                app.router.navigate('/', {trigger: true});
            }else{
                this.listenTo(this.song, 'change', this.render);
            }
        },
        serialize: function(){
            return {
                song: this.song,
                listenMode: this.settings.get('listenMode')
            };
        },
        afterRender: function(){
            this.$el.addClass('recorder-view');
        }
    });

    module.exports = Layout;
});