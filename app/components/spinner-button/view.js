define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var Layout = Backbone.Layout.extend({
    	initialize: function(options){
    		var spinning = typeof options.spinning !== 'undefined' ? options.spinning : false,
    			buttonIcon = typeof options.buttonIcon !== 'undefined' ? options.buttonIcon : false,
    			buttonText = typeof options.buttonText !== 'undefined' ? options.buttonText : 'Click',
    			buttonClass = typeof options.buttonClass !== 'undefined' ? options.buttonClass : 'btn btn-default',
    			spinnerIcon = typeof options.spinnerIcon !== 'undefined' ? options.spinnerIcon : 'glyphicon glyphicon-refresh',
    			hasText = typeof options.hasText !== 'undefined' ? options.hasText : false,
    			hasIcon = typeof options.hasIcon !== 'undefined' ? options.hasIcon : false,
    			buttonId = typeof options.buttonId !== 'undefined' ? options.buttonId : null;
    		this.spinning = spinning;
    		this.buttonIcon = buttonIcon;
    		this.buttonText = buttonText;
    		this.buttonClass = buttonClass;
    		this.spinnerIcon = spinnerIcon;
    		this.hasText = hasText;
    		this.hasIcon = hasIcon;

    		var self = this;
    		this.on('startSpinning', function(){
    			self.spinning = true;
    			self.render();
    		});
    		this.on('stopSpinning', function(){
    			self.spinning = false;
    			self.render();
    		});
    	},
        template: function(){
        	var icon = "",
        		text = "";
        	if(this.spinning){
        		icon = "<span class='"+this.spinnerIcon+"'></span>";
        	}else{
        		icon = "<span class='"+this.buttonIcon+"'></span>";
        	}

        	if(!this.spinning && !this.hasIcon){
        		icon = '';
        	}
        	if(this.hasText){
        		text = this.buttonText;
        	}

        	if(this.buttonId !== null){
        		return "<button id='"+this.buttonId+"' class='"+this.buttonClass+"'>"+icon+text+"</button>";
        	}else{
        		return "<button class='"+this.buttonClass+"'>"+icon+text+"</button>";
        	}
        }
    });

    module.exports = Layout;
});