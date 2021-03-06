define(function(require, exports, module) {
    "use strict";

    var Recorder = {
        timer: null,
        duration: 0,
        events: [],
        recording: false,
        hasRecordedData: function(){
            return this.duration > 0 || this.events.length > 0;
        },
        reset: function(){
            clearInterval(this.timer);
            this.timer = null;
            this.duration = 0;
            this.events = [];
            this.recording = false;
        },
        recordEvent: function(sound, instrument){
            this.events.push({
                instrument: instrument,
                time: this.duration,
                sound: sound
            });
        },
        startRecording: function(){
            var self = this,
                duration = this.duration ? this.duration : 0;
            this.recording = true;
            this.timer = setInterval(function(){
                self.duration = ++duration;
            }, 1);
            this.trigger('recordingStarted');
        },
        stopRecording: function(){
            this.recording = false;
            clearInterval(this.timer);
            this.trigger('recordingStopped');
        }
    };
    _.extend(Recorder, Backbone.Events);

    module.exports = Recorder;
});