define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
    	initialize: function(options){
    		var type = typeof options.type !== 'undefined' ? options.type : 'default',
                spinning = typeof options.spinning !== 'undefined' ? options.spinning : false,
    			buttonIcon = typeof options.buttonIcon !== 'undefined' ? options.buttonIcon : false,
    			buttonText = typeof options.buttonText !== 'undefined' ? options.buttonText : 'Click',
    			buttonClass = typeof options.buttonClass !== 'undefined' ? options.buttonClass : 'btn btn-default',
    			spinnerIcon = typeof options.spinnerIcon !== 'undefined' ? options.spinnerIcon : 'fa fa-spinner fa-spin',
    			hasText = typeof options.hasText !== 'undefined' ? options.hasText : true,
    			hasIcon = typeof options.hasIcon !== 'undefined' ? options.hasIcon : false,
    			buttonId = typeof options.buttonId !== 'undefined' ? options.buttonId : null,
                buttonSize = typeof options.size !== 'undefined' ? options.size : 'md',
                buttonTitle = typeof options.buttonTitle !== 'undefined' ? options.buttonTitle: null,
                clickEvent = typeof options.clickEvent !== 'undefined' ? options.clickEvent : null,
                disabled = typeof options.disabled !== 'undefined' ? options.disabled : false;
            this.type = type;
    		this.spinning = spinning;
    		this.buttonIcon = buttonIcon;
    		this.buttonText = buttonText;
    		this.buttonClass = buttonClass;
            this.buttonTitle = buttonTitle;
    		this.spinnerIcon = spinnerIcon;
    		this.hasText = hasText;
    		this.hasIcon = hasIcon;
            this.size = buttonSize;
            this.clickEvent = clickEvent;
            this.disabled = disabled;
            this.buttonId = buttonId;
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
        events: {
            'click .spinner-button': 'clickedButton'
        },
        clickedButton: function(){
            if(this.clickEvent !== null){
                this.trigger(this.clickEvent);
            }
        },
        getClassForType: function(type){
            switch(type){
                case 'success':
                case 'danger':
                case 'warning':
                    return 'btn btn-'+type;
                default:
                    return 'btn btn-default';
            }
        },
        getClassForSize: function(size){
            switch(size){
                case 'x-small':
                case 'xs':
                    return 'btn-xs';
                case 'small':
                case 'sm':
                    return 'btn-sm';
                case 'large':
                case 'lg':
                    return 'btn-lg';
                default:
                    return '';
            }
        },
        serialize: function(){
            return {
                spinning: this.spinning,
                spinnerIcon: this.spinnerIcon,
                hasText: this.hasText,
                hasIcon: this.hasIcon,
                buttonIcon: this.buttonIcon,
                buttonText: this.buttonText,
                buttonClass: this.buttonClass,
                buttonId: this.buttonId,
                bootstrapType: this.getClassForType(this.type),
                bootstrapSize: this.getClassForSize(this.size),
                buttonTitle: this.buttonTitle,
                disabled: this.disabled
            };
        }
    });

    module.exports = Layout;
});