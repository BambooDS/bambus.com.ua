/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document */

define(['backbone', 'preloader'], function(Backbone, preloader) {
    'use strict';
    var Menu = Backbone.View.extend({
        events: {
            "mousemove": "show",
            "mouseleave": "hideDelayed",
            "click .parent-link": "showSubMenu",
            "click .back": "hideSubMenu",
            "click .logo": "hideSubMenu",
            'click .close-page': function() {
                Backbone.history.navigate("portfolio", {trigger: true});
            },
            'click .open-meta': function() {
                $('.meta-container').toggleClass('active');
                setTimeout(function() {
                    $('.meta-container').toggleClass('openup');
                }, 500);
            }
        },
        initialize: function(options) {
            var pathArray = window.location.pathname.split('/');
            var secondLevelLocation = pathArray[1];
            if (secondLevelLocation === 'en') {
                var el = document.getElementById('ukr');
                el.parentNode.removeChild(el);
            } else {
                var el = document.getElementById('eng');
                el.parentNode.removeChild(el);
            }

            var el = document.querySelector('.menu-panel');
            this.setElement(el);
            this.menuWrapper = this.el.querySelector('#menu-wrapper');
            this.menu = this.menuWrapper.querySelector('.main-menu');
            preloader.dispatcher.on('loaded', this.hideDelayed, this)
        },
        hide: function() {
            this.menuWrapper.classList.add('hide');
            this.hideSubMenu();
        },
        hideDelayed: function() {
            this.hide();
        },
        show: function(e) {
            if (e.target.className === 'open-meta' || e.target.className === 'close-page') {
                console.log('WRONG HOVER BABY');
            } else {
                this.menuWrapper.classList.remove('hide');
            }
        },
        showSubMenu: function(event) {
            event.stopImmediatePropagation();
            this.menu.classList.add('show-child');
        },
        hideSubMenu: function(event) {
            event && event.stopImmediatePropagation();
            this.menu.classList.remove('show-child');
        }
    });
    return Menu;
});
