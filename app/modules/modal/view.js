define(function(require, exports, module) {
    "use strict";

    var app = require("app");
    var ModalModel = require('./model');

    var Layout = Backbone.Layout.extend({
        template: require("ldtpl!./template"),
        destroyModal: function(){
            this.hide();
            this.model = new ModalModel();
        },
        getSizeClass: function(size){
            switch(size){
                case 'sm':
                case 'small':
                    return 'modal-sm';
                case 'lg':
                case 'large':
                    return 'modal-lg';
                default:
                    return '';

            }
        },
        serialize: function() {
            return {
                model: this.model,
                sizeClass: this.getSizeClass(this.model.get('size'))
            };
        },
        afterRender: function() {
            this.$modal = this.$el.find('.modal').eq(0);
            if(this.model.get('visible')){
                this.show();
            }
        },
        show: function(){
            this.$modal.modal('show');
        },
        hide: function(){
            this.$modal.modal('hide');
            $('.modal-backdrop').remove();
        },
        initialize: function() {
            if(!this.model){
                this.model = new ModalModel();
            }
            this.listenTo(this.model, 'change', this.render);
        },
        events: {
            "click .modal-ok": 'okClicked'
        },
        okClicked: function(){
            var targ = this.model.get('actionTarget'),
                act = this.model.get('okAction');
            if(targ && act){
                targ.trigger(act);
            }
        }
    });

    module.exports = Layout;
});