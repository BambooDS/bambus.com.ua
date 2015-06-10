/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _ */

define(['page', 'slider'], function (Page, Slider) {
    'use strict';
    var Home = Page.extend({
        name: 'home',
        // TODO stop and run slider on page show
        render: function () {
            var pathArray = window.location.pathname.split('/');
            var secondLevelLocation = pathArray[1];
            if (secondLevelLocation === 'en') {
                document.querySelector('[href="/about"]').setAttribute('href', '/en/about');
            }
            
            this.rendered = true;
            console.log('redern home');
            this.widgets = _.extend(this.widgets || {}, {
                slider: new Slider({parent: this, container: '#slider', slide: 'section'})
            });
            return this;
        }
    });
    return Home;
});
