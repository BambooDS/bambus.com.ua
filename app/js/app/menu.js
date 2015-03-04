/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document */

define(['backbone','preloader'], function (Backbone, preloader) {
    'use strict';
    var Menu = Backbone.View.extend({
        events:{
            "mousemove":"show",
            "mouseleave":"hideDelayed",
            "click .parent-link": "showSubMenu",
            "click .back": "hideSubMenu",
            "click .logo": "hideSubMenu"
        },
        initialize: function (options) {
            var el = document.querySelector('.menu-panel');
            this.setElement(el);
            this.menuWrapper = this.el.querySelector('#menu-wrapper');
            this.menu = this.menuWrapper.querySelector('.main-menu');
            preloader.dispatcher.on('loaded',this.hideDelayed,this)
        },

        hide: function () {
            this.menuWrapper.classList.add('hide');
            this.hideSubMenu();
        },
        hideDelayed: function () {
            //setTimeout(this.hide.bind(this),500);
            this.hide();
        },
        show: function () {
            this.menuWrapper.classList.remove('hide');
        },
        showSubMenu: function (event) {
            event.stopImmediatePropagation();
            this.menu.classList.add('show-child');
        },
        hideSubMenu: function (event) {
            event && event.stopImmediatePropagation();
            this.menu.classList.remove('show-child');
        }
    });
    return Menu;
});
