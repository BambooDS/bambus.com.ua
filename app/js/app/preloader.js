/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, window, _ */

define(['backbone','helper'], function (Backbone, Helper) {
    'use strict';
    
    var Preloader = function () {
        this.el = document.getElementById('preloader');
        this.loaded = false;
        this.toLoad = [];
        this.documentLoaded = false; 
        this.duration = 4;
        this.el.parentNode.classList.add('dom-loaded');
        this.timeStamp = new Date();
        this.dispatcher = _.clone(Backbone.Events);
        this.init();
    };
    
    Preloader.prototype.log = function (str) { 
        console.log('preloader: ' + str);
    };
    Preloader.prototype.playVideo = function () {
        var logo = this.el.querySelector('.logo');
        setTimeout(function () {logo.style.display = 'block'}, 500)
//        var video  = this.el.querySelector('video');
//        video.addEventListener('ended', function() { 
//            this.currentTime = this.duration - 0.09; 
//            console.log(this.duration)
//        }, false);
//        video.play();
    }
    Preloader.prototype.init = function () {
        console.log('init?');
        this.dispatcher.on('loaded',function(){this.loaded = true;}.bind(this));
        if (document.readyState === "complete") {
            this.documentLoaded = true;
            this.log('dom loaded before');
            this.test();
            this.playVideo();
        } else {
            window.addEventListener('load', function () {
                this.documentLoaded = true;
                this.log('dom loaded');
                this.test();
                this.playVideo();
            }.bind(this), false);
        }
    };
    // check if all modules are loaded
    Preloader.prototype.checkLoadingState = function () {
        if (this.toLoad.length === 0) {
            return true;
        }
        return this.toLoad.every(function (el) {
            return el.state;
        });
    };
    Preloader.prototype.push = function (name) {
        this.toLoad.push({
            name: name,
            state: false
        });
        this.log('added ' + name);
    };
    Preloader.prototype.done = function (name) {
        console.log(this.toLoad)
        this.toLoad.forEach(function (el, index, arr) {
            if (el.name === name) {
                _.each(arr, function(el){
                    console.log(el)
                })
                arr.splice(index, 1);
                this.log('done ' + name);
                console.log(arr)
            }
        },this);
        this.test();
    };
    Preloader.prototype.subloading = function () {
        this.el.style.display = "block";
        this.subloadingState = true;
        document.documentElement.classList.add('sub-loading');
    };
    Preloader.prototype.releaseSubloading = function () {
        document.documentElement.classList.remove('sub-loading');
        this.dispatcher.trigger('sub-loaded');
        this.subloadingState = false;
    }
    Preloader.prototype.hide = function () {
        // hide
        this.el.addEventListener(Helper.transEndEventName, function remover(event){
            if(event.propertyName.indexOf('transform')==-1){
                return;
            }
            //this.style.display = 'none';
            this.removeEventListener(Helper.transEndEventName, remover, false);
        },false);
        // fade
        if (this.timeStamp  - new Date() < this.duration * -1000) {
            this.log(['in time', (this.timeStamp  - new Date())]);
            document.documentElement.classList.add('loaded');
            this.dispatcher.trigger('loaded');
        } else {
            this.log(['need to wait', (this.duration * 1000 - (this.timeStamp  - new Date()))]);
            setTimeout(function () {
                document.documentElement.classList.add('loaded');
                this.dispatcher.trigger('loaded');
            }.bind(this), (this.duration * 1000 - (this.timeStamp  - new Date())));
        }

    };
    // test if all modules are loaded and hide if so
    Preloader.prototype.test = function () {
        // init Preloader if not inited yet
        if (this.documentLoaded === false) {
            this.init();
            return;
        }
        if (this.checkLoadingState() && this.documentLoaded) {
            this.hide();
        }
    };
    return new Preloader();

});
