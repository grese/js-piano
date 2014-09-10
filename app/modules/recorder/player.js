define(function(require, exports, module) {
    "use strict";

    var Player = {
        state: 'stop',
        timer: null,
        playHead: 0,
        eventIdx: 0,
        advancePlayer: function(){
            var self = this,
                interval = setInterval(function(){
                    if(self.playback.state !== 'fwd'){
                        clearInterval(interval);
                        return;
                    }else{
                        var numEvts = self.recorder.events.length,
                            evt = self.recorder.events[self.playback.eventIdx];

                        if(evt){
                            if(self.playback.playHead >= evt.time){
                                if(numEvts > self.playback.eventIdx){
                                    ++self.playback.eventIdx;
                                }
                            }
                            if(self.playback.playHead < self.recorder.duration){
                                ++self.playback.playHead;
                                self.updatePlaybackProgress(self.recorder.duration, self.playback.playHead);
                            }else{
                                self.playback.playHead = self.recorder.duration;
                                self.updatePlaybackProgress(self.recorder.duration, self.recorder.duration);
                            }
                        }
                    }
                }, 1);
        },
        rewindPlayer: function(){
            var self = this;
            self.playback.timer = setInterval(function() {
                var evt;
                if (self.playback.state !== 'rew') {
                    clearInterval(self.playback.timer);
                    return;
                } else {
                    evt = self.recorder.events[self.playback.eventIdx];
                    if (evt) {
                        if (self.playback.playHead > 0) {
                            --self.playback.playHead;
                            self.updatePlaybackProgress(self.recorder.duration, self.playback.playHead);
                        } else {
                            self.playback.playHead = 0;
                            self.updatePlaybackProgress(1, 0);
                        }
                        if ((self.playback.eventIdx > 0) && (self.playback.playHead < evt.time)) {
                            var nextEvt = self.recorder.events[self.playback.eventIdx-1];
                            if(nextEvt.time < self.playback.playHead){
                                --self.playback.eventIdx;
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
                    self.playback.eventIdx = 0;
                }
                if(typeof pos === 'undefined'){
                    self.playback.playHead = 0;
                }

                self.playback.timer = setInterval(function(){
                    ++self.playback.playHead;
                    if(self.playback.eventIdx < numSounds){
                        sound = self.recorder.events[self.playback.eventIdx];
                    }else{
                        clearInterval(self.playback.timer);
                        self.updatePlaybackProgress(totalDuration, totalDuration);
                        self.playback.state = 'stop';
                    }
                    if(sound && sound.time === self.playback.playHead){
                        self.playSound(sound.sound);
                        self.playback.eventIdx++;
                    }else if(sound && sound.time < self.playback.playHead){
                        self.playback.eventIdx++;
                    }
                    if(self.playback.playHead % 10 === 0)
                        self.updatePlaybackProgress(totalDuration, self.playback.playHead);
                }, 1);
            }
        },
        stopPlayback: function(){
            clearInterval(this.playback.timer);
            this.playback.playHead = 0;
            this.playback.eventIdx = 0;
            this.playback.state = 'stop';
            this.updatePlaybackProgress(1,0);
        },
        pausePlayback: function(){
            clearInterval(this.playback.timer);
            this.playback.state = 'pause';
        }
    };

    _.extend(Player, Backbone.Events);

    module.exports = Player;
});