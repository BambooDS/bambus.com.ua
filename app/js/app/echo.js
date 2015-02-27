/*! Echo v1.4.0 | (c) 2013 @toddmotto | MIT license | github.com/toddmotto/echo */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _ */

define( function () { 
    'use strict';
    var Echo = function (options) {
        var store = [], offset, throttle, poll, inited = false, rootEl, root = document;

        var _inView = function (el) {
            var coords = el.getBoundingClientRect();
            return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset));
        };
        
        var _pollImages = function () {
            for (var i = store.length; i--;) {
                var self = store[i];
                if (_inView(self)) {
                    self.src = self.getAttribute('data-echo');
                    self.parentNode.classList.add('echo-loaded');
                    store.splice(i, 1);
                }
            }
        };

        var _throttle = function () {
            clearTimeout(poll);
            poll = setTimeout(_pollImages, throttle);
        };


        var addImages = function (data) {
            if(data.length){
                store = store.concat(data);    
            }else{
                store.push(data);
            }
            _pollImages();
        }
        var init = function (obj) {
            
            var opts = obj || {};
            rootEl = opts.root || window;
            offset = opts.offset  || 0;
            throttle = opts.throttle  || 250;
            //        for (var i = 0; i < nodes.length; i++) {
            //            store.push(nodes[i]);
            //        }


            if (document.addEventListener) {
                rootEl.addEventListener('scroll', _throttle, false);
            } else {
                rootEl.attachEvent('onscroll', _throttle);
            }
        };
        
        init (options);
        
        return {
            add: addImages
        };
    
    }
    return Echo;
    
});