define(function(require, exports, module) {
    "use strict";

    var app = require("app");

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        initialize: function(options){
            if(!options) options = {};
            var type = typeof options.type !== 'undefined' ? options.type : 'default',
                alertIcon = typeof options.alertIcon !== 'undefined' ? options.alertIcon : false,
                alertMessage = typeof options.alertMessage !== 'undefined' ? options.alertMessage : '',
                alertTitle = typeof options.alertTitle !== 'undefined' ? options.alertTitle : '',
                dismissable = typeof options.dismissable !== 'undefined' ? options.dismissable : true,
                autoDismiss = typeof options.autoDismiss !== 'undefined' ? options.autoDismiss : true,
                active = typeof options.active !== 'undefined' ? options.active : true,
                autoDismissDelay = typeof options.autoDismissDelay !== 'undefined' ? options.autoDismissDelay : 3000;
            this.type = type;
            this.alertIcon = alertIcon;
            this.alertMessage = alertMessage;
            this.alertTitle = alertTitle;
            this.dismissable = dismissable;
            this.autoDismiss = autoDismiss;
            this.active = active;
            this.autoDismissDelay = autoDismissDelay;
        },
        afterRender: function(){
            this.$alert = this.$el.find('.alert').eq(0);
            if(this.autoDismiss && this.$alert){
                var self = this;
                setTimeout(function(){
                    //self.$alert.alert('close');
                }, this.autoDismissDelay);
            }
        },
        getClassForType: function(type){
            switch(type){
                case 'success':
                case 'danger':
                case 'warning':
                    return 'alert alert-'+type;
                default:
                    return 'alert alert-info';
            }
        },
        getIconForType: function(type){
            switch(type){
                case 'success':
                    return 'fa fa-check-circle fa-lg';
                case 'danger':
                    return 'fa fa-ban fa-lg';
                case 'warning':
                    return 'fa fa-exclamation-circle';
                default:
                    return 'fa fa-info-circle fa-lg';
            }
        },
        serialize: function(){
            return {
                alertIcon: this.getIconForType(this.type),
                alertMessage: this.alertMessage,
                alertClass: this.getClassForType(this.type),
                dismissableClass: this.dismissable ? 'alert-dismissable' : '',
                alertTitle: this.alertTitle,
                dismissable: this.dismissable,
                active: this.active
            };
        }
    });

    module.exports = Layout;
});