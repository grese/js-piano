define(function(require, exports, module) {
    "use strict";

    var Player = {
        state: 'stop',
        timer: null,
        playHead: 0,
        eventIdx: 0,
        recorder: null,
        advancePlayer: function(){
            var self = this,
                interval = setInterval(function(){
                    if(self.state !== 'fwd'){
                        clearInterval(interval);
                        return;
                    }else{
                        var numEvts = self.recorder.events.length,
                            evt = self.recorder.events[self.eventIdx];
                        if(evt){
                            if(self.playHead >= evt.time){
                                if(numEvts > self.eventIdx){
                                    ++self.eventIdx;
                                }
                            }
                            if(self.playHead < self.recorder.duration){
                                ++self.playHead;
                                self.trigger('playbackProgress', self.recorder.duration, self.playHead);
                            }else{
                                self.playHead = self.recorder.duration;
                                self.trigger('playbackProgress', self.recorder.duration, self.recorder.duration);
                            }
                        }
                    }
                }, 1);
        },
        rewindPlayer: function(){
            var self = this;
            self.timer = setInterval(function() {
                var evt;
                if (self.state !== 'rew') {
                    clearInterval(self.timer);
                    return;
                } else {
                    evt = self.recorder.events[self.eventIdx];
                    if (evt) {
                        if (self.playHead > 0) {
                            --self.playHead;
                            self.trigger('playbackProgress', self.recorder.duration, self.playHead);
                        } else {
                            self.playHead = 0;
                            self.trigger('playbackProgress', 1, 0);
                        }
                        if ((self.eventIdx > 0) && (self.playHead < evt.time)) {
                            var nextEvt = self.recorder.events[self.eventIdx-1];
                            if(nextEvt.time < self.playHead){
                                --self.eventIdx;
                            }
                        }
                    }
                }
            }, 1);
        },
        startPlayback: function(pos, eventIdx){
            var self = this;
            if(!this.settings.recording){
                var sound = null,
                    numSounds = self.recorder.events.length,
                    totalDuration = self.recorder.duration;

                if(typeof eventIdx === 'undefined'){
                    self.eventIdx = 0;
                }
                if(typeof pos === 'undefined'){
                    self.playHead = 0;
                }

                self.timer = setInterval(function(){
                    ++self.playHead;
                    if(self.eventIdx < numSounds){
                        sound = self.recorder.events[self.eventIdx];
                    }else{
                        clearInterval(self.timer);
                        self.trigger('playbackProgress', totalDuration, totalDuration);
                        self.state = 'stop';
                    }
                    if(sound && sound.time === self.playHead){
                        self.playSound(sound.sound);
                        self.eventIdx++;
                    }else if(sound && sound.time < self.playHead){
                        self.eventIdx++;
                    }
                    if(self.playHead % 10 === 0)
                        self.trigger('playbackProgress', totalDuration, self.playHead);

                }, 1);
            }
        },
        stopPlayback: function(){
            clearInterval(this.timer);
            this.playHead = 0;
            this.eventIdx = 0;
            this.state = 'stop';
            this.trigger('playbackProgress', 1,0);
        },
        pausePlayback: function(){
            clearInterval(this.timer);
            this.state = 'pause';
        }
    };

    _.extend(Player, Backbone.Events);

    module.exports = Player;
});