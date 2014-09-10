define(function(require, exports, module) {
    "use strict";

    var Recorder = {
        timer: null,
        duration: 0,
        events: [],

        recordSound: function(sound){
            this.recorder.events.push({
                instrument: this.settings.instrument,
                time: this.recorder.duration,
                sound: sound
            });
        },
        startRecord: function(){
            var self = this,
                duration = this.recorder.duration ? this.recorder.duration : 0;
            this.recorder.timer = setInterval(function(){
                self.recorder.duration = ++duration;
            }, 1);
        },
        stopRecord: function(){
            clearInterval(this.recorder.timer);
            this.render();
        }
    };

    _.extend(Recorder, Backbone.Events);

    module.exports = Recorder;
});