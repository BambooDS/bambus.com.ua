/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define */

define(['page', 'triangles'], function (Page, Triangles) {
    'use strict';
    var Notfoundpage = Page.extend({
        name: 'page404',
        render: function () {
            this.modules = {
                "image":  new Triangles({
                    canvasId:'animation404', 
                    src:'/pictures/404.png',
                    maxLineDistance: 40,
                    static: false,
					maxLineDistance2: 40,
                    counterValue: 2,
					topOffset: $('.animation-text-404').offset().top,
					leftOffset: $('.animation-text-404').offset().left,
                })
            };
            this.modules.image.start();
            this.rendered = true;
            return this;
        }
    });
    return Notfoundpage;
});
