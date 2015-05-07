/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _, $ */

define(['helper', 'portfolio_collection', 'page', 'app', 'backbone', 'mustache', 'echo', 'preloader', 'wow', '../../bower_components/imagesloaded/imagesloaded.pkgd.min.js'], function(helper, PortfolioCollection, Page, app, Backbone, Mustache, Echo, preloader, WOW, ImagesLoaded) {
    'use strict';
    //render project page : needed for take prev next links and for id/slug rewrite and for relate projects
    var portfolio_model = PortfolioCollection.prototype.model.extend({view: Backbone.View});
    var portfolio_collection = PortfolioCollection.extend({model: portfolio_model})


    var ProjectView = Page.extend({
        events: {
            'click .close-page': function() {
                app.navigate("portfolio", {trigger: true});
            },
            'click .open-meta': function() {
                 $('.meta-container').toggleClass('active');
            },
            'mouseleave  .meta-container': function() {
                 $('.meta-container').removeClass('active');
            }
        },
        name: "portfolio-theme",
        showHook: function() {
            if (preloader.loaded) {
                if (this.wow.element) {
                    this.wow.scrollCallback();
                } else {
                    this.wow.init();
                }
            } else {
                setTimeout(this.showHook.bind(this), 1000);
            }
        },
        initialize: function(options) {
            this.model = options.model;
            app.on('route', this.checkHide.bind(this));
        },
        render: function(firstRun) {
            // first run - set elem
            if (firstRun) {
                document.body.appendChild(this.el);
                this.list = this.el.querySelector('.projects-list');
                this.echo = new Echo({
                    offset: 100,
                    throttle: 250,
                    root: this.el
                });
                this.wow = new WOW({
                    boxClass: 'wow', // animated element css class (default is wow)
                    animateClass: 'animated', // animation css class (default is animated)
                    offset: 50, // distance to the element when triggering the animation (default is 0)
                    mobile: false, // trigger animations on mobile devices (true is default)
                    root: this.el
                });
                this.portfolio = new portfolio_collection([], {view: this});
                new ImagesLoaded(this.el, this.render.bind(this, false));
                return;
            }

            this.rendered = true;
            preloader.done(this.model.name);

            this.show();
            return this;
        },
        renderCustom: function() {
            console.log('renderCustom');
            requirejs(["text!/pages/" + this.model.name + ".html", 'mustache'], function(html) {
                var data = this.model.get('project');
                console.log(data);
                // remove bambus studion from owners
                data.owners.forEach(function(el, index) {
                    if (el.id === 2975629) {
                        data.owners.splice(index, 1);
                    }
                });

                this.setElement(Mustache.render(html, data));
                console.log(this.e);
                this.render(true);
            }.bind(this));
        },
        renderRegular: function() {
            console.log('renderRegular');
            requirejs(["text!/templates/partials/portfolio/template.html", 'mustache'], function(html) {
                var data = this.model.get('project');
                
                console.log(data);

                var backImage = '/custom_backgrounds/' + data.name.toLowerCase().replace(/\s/g, "-").replace(/("|')/g, "") + '.jpg';
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open('HEAD', backImage, false);
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == 4) {
                        if (xmlhttp.status == 200) {
                            data.backImage = backImage;
                        }
                    }
                };
                xmlhttp.send(null);

                // change time to white if background is to light
                var backColorLigthness = helper.colorConvertor.toHSV(helper.colorConvertor.hexToRGB(data.styles.background.color)).v;
                if (backColorLigthness > 60) {
                    data.whitepage = "whitepage";
                }

                // remove bambus studion from owners
                data.owners.forEach(function(el, index) {
                    if (el.id === 2975629) {
                        data.owners.splice(index, 1);
                    }
                });
                data.modules.forEach(function(el, index) {
                    if (el.type === 'image' && !data.preview) {
                        data.preview = el;
                        delete data.modules[index];
                    }
//                    if(el.type === 'text' && el.text.indexOf('class="title"')==-1){
//                        el.text = '<p>'+el.text_plain+'</p>';
//                    }
                    if (el.type === 'text' && el.text_plain.toLowerCase().indexOf('замовник') != -1) {
                        data.client = el.text_plain.substring(10);
//                        data.modules.splice(index,1);
                        delete data.modules[index];
                    }

                });
                var url_extacted = data.description.match(/\b(http:\/\/|www)[\w.\/?=-]+\b/g);
                if (url_extacted) {
                    data.external_url_trimmed = url_extacted[0].replace('http://', '').replace('www.', '')
                    data.external_url = 'http://' + data.external_url_trimmed;
                }
                var date = new Date(parseInt(data.published_on + '000'));
                data.date = ((date.getDate() < 10) ? '0' + date.getDate() : date.getDate()) + '.' + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();

                this.setElement(Mustache.render(html, data));
                this.render(true);
            }.bind(this));
        },
        renderBackgroundImage: function() {
            console.log('renderBackgroundImage');
            requirejs(["text!/templates/partials/portfolio/template-background-image.html", 'mustache'], function(html, mustache) {
                var data = this.model.get('project');

                // remove bambus studion from owners
                data.owners.forEach(function(el, index) {
                    if (el.id === 2975629) {
                        data.owners.splice(index, 1);
                    }
                });


                var backImage = '/custom_backgrounds/' + data.name.toLowerCase().replace(/\s/g, "-").replace(/("|')/g, "") + '.jpg';
                data.backImage = backImage;

                console.log(data);

                this.setElement(Mustache.render(html, data));
                this.render(true);
            }.bind(this));
        }
    });





    var ProjectModel = Backbone.Model.extend({
        url: function() {
            var endPoint = 'http://www.behance.net/v2/projects';
            var apiKey = 'hiHNrEFZrHRZ6cZogKANRsMayAibW07s';
            var server = 'http://new.bambus.com.ua';
            var action = 'lib/getProjectsBehance.php?urlProjects';

            console.log('ProjectModel ID - ', this.id);
//                this.id = '20238479';

            return server + '/' + action + '=' + encodeURIComponent(endPoint + '/' + (this.id || 18389599) + '?api_key=' + apiKey);
        },
        initialize: function(options) {
            preloader.push(options.name);
            this.name = options.name;

            this.view = new ProjectView({model: this});
            this.load();
        },
        load: function() {
            $.ajax('/templates/partials/portfolio/' + this.name + '.html', {
                context: this,
                type: "HEAD",
                statusCode: {
                    404: function() {
                        var backImageUrl = '/custom_backgrounds/' + this.name.toLowerCase().replace(/\s/g, "-").replace(/("|')/g, "") + '.jpg';
                        var self = this;
                        this.fetch().done(function() {
                            $.get(backImageUrl).done(function() {
                                self.view.renderBackgroundImage();
                            }).fail(function() {
                                self.view.renderRegular();
                            });
                        });
                    }, 
                    200: function() {
                        var self = this;
                        this.fetch().done(function() {
                            self.view.renderCustom();
                        });
                    }
                }
            });

        }
    });
    return ProjectModel;
});
