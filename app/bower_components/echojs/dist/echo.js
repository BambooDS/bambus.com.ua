/*! Echo v1.4.0 | (c) 2013 @toddmotto | MIT license | github.com/toddmotto/echo */
window.Echo = (function (window, document, undefined) {

  'use strict';

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
        store.splice(i, 1);
      }
    }
  };

  var _throttle = function () {
    clearTimeout(poll);
    poll = setTimeout(_pollImages, throttle);
  };
  var init = function (obj) {
   
    var opts = obj || {};
    rootEl = opts.root || root;
    var nodes = rootEl.querySelectorAll('[data-echo]');
    offset = opts.offset || offset || 0;
    throttle = opts.throttle || throttle || 250;
    for (var i = 0; i < nodes.length; i++) {
      store.push(nodes[i]);
    }

    _throttle();
      
    if(!inited){  
        if (document.addEventListener) {
          window.addEventListener('scroll', _throttle, false);
        } else {
          window.attachEvent('onscroll', _throttle);
        }
    }
  inited = true;
  };

  return {
    init: init,
    render: _throttle
  };

})(window, document);
