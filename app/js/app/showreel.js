/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _, mina */

define(['page', 'backbone', 'helper', 'preloader'], function (Page, Backbone, helper, preloader) {
    'use strict';
    var Showreel = Page.extend({
        name: 'showreel',
        events: {
            "click": function () {
                this.video.play();
            }
        },
        hideHook: function () {
            this.video.pause();
            this.video.currentTime = 0;
        },
        showHook: function () {
            if (preloader.loaded) {
                console.log('showreel loaded');
                this.video.play();
            } else {
                setTimeout(this.showHook.bind(this), 1000);
            }
        },
        render: function () {
            this.modules = this.modules || {};
            this.video = this.el.querySelector('#main-showreel');
            return this;
        }
    });
    return Showreel;
});
