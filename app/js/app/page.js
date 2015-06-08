/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _ */

define(['preloader', 'app', '../../bower_components/imagesloaded/imagesloaded.pkgd.js', 'text'], function(preloader, app, ImagesLoaded) {
    'use strict';
    var Page = Backbone.View.extend({
        name: 'pagename',
        initialize: function(params) {
            app.on('route', this.checkHide.bind(this));

            if (!this.template) {
                var languageTriger = '';
                if (params) {
                    if (params.language === 'en') {
                        languageTriger = 'en';
                    }
                }
                require(['text!../../pages/' + languageTriger + '/' + this.name + '.html'], function(template) {
                    this.template = template;
                    setTimeout(function() {
                        this.initialize();
                    }.bind(this), 500);
                }.bind(this));

                return false;

            } else {
                preloader.push(this.name);
                this.setElement(this.template);
                document.body.appendChild(this.el);
                this.initHook();
                this.preparePage();
            }
        },
        preparePage: function() {
            if (this.imagesReady) {
                var self = this;
                preloader.done(self.name);
                self.show();
            } else {
                var imgLoad = new ImagesLoaded(this.el);
                imgLoad.on('always', function() {
                    this.imagesReady = true;
                    this.preparePage();
                }.bind(this));
            }
        },
        initHook: function(options) {

        },
        showHook: function(options) {

        },
        hideHook: function() {

        },
        render: function() {
            this.rendered = true;
            return this;
        },
        show: function() {
            if (!this.rendered) {
                this.render();
            }
            if (this.timer) {
                clearTimeout(this.timer);
            }
            document.documentElement.classList.add(this.name);
            this.el.classList.add('visible');

            if (preloader.subloadingState) {
                this.timer = setTimeout(function() {
                    preloader.releaseSubloading();
                    clearTimeout(this.timer);
                    this.showHook();
                }.bind(this), 500);
            } else {
                this.showHook();
            }
            return this;
        },
        checkHide: function() {
            if (app.currentPage !== this.name) {
                this.hide();
            }
        },
        hide: function() {
            document.documentElement.classList.remove(this.name);
            preloader.subloading();
            clearTimeout(this.timer);
            this.timer = setTimeout(function() {
                clearTimeout(this.timer);
//                this.el.classList.remove('visible');
                this.hideHook();
                this.remove().trigger('remove');
            }.bind(this), 500);
            return this;
        }
    });
    return Page;
});
