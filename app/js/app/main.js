/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, requirejs */



requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: '/js/app',
    shim: {
        'modernizr-custom': {
            exports: 'Modernizr'
        },
        'wow': {
            exports: 'WOW'
        },
        'snap.svg': {
            exports: 'Snap'
        },
        'socketio': {
            exports: 'io'
        },
    }, 
    paths: {
        socketio: '//localhost:3000/socket.io/socket.io.js',
        backbone: '../../bower_components/backbone/backbone',
        bower: '../../bower_components',
        underscore: '../../bower_components/underscore/underscore',
        jquery: '../../bower_components/jquery/dist/jquery',
        masonry: '../../bower_components/masonry/dist/masonry.pkgd',
        hamster: '../../bower_components/hamsterjs/hamster',
        mustache: '../../bower_components/mustache/mustache',
        snapsvg: '../../bower_components/Snap.svg/dist/snap.svg',
        picturefill: '../../bower_components/picturefill/picturefill'
    }
});



requirejs(['picturefill', 'modernizr-custom', 'text', 'async'], function(picturefill) {

    'use strict';

    //Browser support checking
    if (Modernizr.cssanimations &&
        Modernizr.csstransforms &&
        Modernizr.csstransitions &&
        Modernizr.canvas)
    {
        window.picturefill = picturefill;
        requirejs(['app']);
    } else {
        requirejs(['text!../../pages/nosupport.html'], function (html) {
            document.body.innerHTML = html;
        });
    }
});
