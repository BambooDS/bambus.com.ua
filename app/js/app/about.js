/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _, mina, FormData, $, requestAnimationFrame */

define(['page', 'masonry', 'backbone', 'hamster', 'wow', 'helper', 'preloader', 'slider'], function (Page, Masonry, Backbone, hamster, WOW, helper, preloader, Slider) {
    'use strict';
    helper.loadCss('/bower_components/wow/css/libs/animate.css', 'animate-styles');

    var SwitcherModel = Backbone.Model.extend({
        initialize: function () {
            this.on('change:type', this.countByType);
        },
        setType: function (type) {
            this.set('type', type);
        },
        countByType: function () {
            var type = this.get('type');
            var people = this.get('people');
            var counted = _.map(people, function (el) {
                //return Math.round(Math.random()*10);
                var yes = 0;
                el.forEach(function (el) {
                    if (_.contains(el, type)) {
                        yes++;
                    }
                });
                return yes;
            });
            this.set({'counted': counted});
            this.trigger('change:counted');
        }
    });
    var Switcher = Backbone.View.extend({
        stopped: true,
        speed: 50,
        events: {
            "mouseover .icons div": function (e) {
                this.stop();
                this.model.set({'type': e.currentTarget.dataset.type});
            },
            "mouseout .icons div": function (e) {
                this.auto();
            }
        },
        initialize: function (options) {



            this.model = new SwitcherModel({
                counted: [0, 0],
                type: 'bicycle',
                types: ['bicycle', 'cakes', 'games', 'music', 'cloth', 'love', 'psyho', 'ski', 'travel', 'yoga'],
                people: {
                    man: [
                        ['music', 'games', 'love'],//Лесик
                        ['games', 'yoga', 'bicycle', 'love'],//Яків
                        ['love'],//Роман Рой
                        ['cloth', 'love'],//шпирка
                        ['music', 'love', 'bicycle'],//Ростик
                        ['music', 'games', 'love', 'yoga', 'psyho'],//Олесь
                        ['music', 'games', 'yoga'],//Любомир
                        ['games', 'travel', 'love', 'ski', 'music'],//Роман Тарабань
                        ['music', 'bicycle', 'travel'],//Роман Вітак
                        ['love', 'music', 'ski'],//Славік
                        ['bicycle', 'games', 'travel', 'cloth'],//Андрій
                        ['ski', 'love', 'psyho', 'travel']//Коберник

                    ],
                    women: [
                        ['bicycle', 'cakes', 'cloth', 'love', 'travel'],//Ната
                        ['love', 'ski', 'travel'],//Марта
                        ['cakes', 'love', 'games', 'ski', 'travel'],//Наталя
                        ['psyho', 'bicycle', 'cloth', 'love', 'ski', 'travel'],//Христя
                        ['bicycle', 'cloth', 'travel'],//Лена Голубятнікова
                        ['love'],//Маряна
                        ['travel'],//Рокса
                        ['yoga'],//Гертруда
                        ['music', 'bicycle', 'love', 'travel'],//Оля
                        ['bicycle', 'cakes', 'love', 'travel', 'ski'],//Лена
                        ['games', 'love'],//Діана
                        ['music', 'cloth', 'love', 'travel', 'ski'],//Кароліна
                        ['music', 'cloth'],//Оленка Майхрич
                        ['yoga', 'travel', 'cloth']//Олена Хомякова
                    ]
                }
            });

            this.on('remove', this.stop);
            this.on('remove', function () {
                console.log('ASDASDASD');
            });
            this.listenTo(this.model, 'change:counted', this.processPeople);
            this.listenTo(this.model, 'change:type', function () {
                _.each(this.el.querySelectorAll('.icons div'), function (el) {
                    el.classList.remove('active');
                });
                this.el.querySelector('[data-type="' + this.model.get('type') + '"]').classList.add('active');
            });
            this.setElement(options.parent.el.querySelector('#team-switch'));
            this.render();
            this.auto();
        },
        stop: function () {
            this.stopped = true;
            clearInterval(this.autoplay);
        },
        auto: function () {
            if (!this.stopped) {
                return false;
            }
            this.autoplay = setInterval(function () {
                var types = this.model.get('types'),
                    index = Math.max(0, _.indexOf(types, this.model.get('type')));
                if (index >= types.length - 1) {
                    index = -1;
                }
                index++;
                this.model.setType(types[index]);

            }.bind(this), 1500);
        },
        highligthPeople: function (type, count) {
            // get all items
            var peoples = this.el.querySelectorAll('.' + type + ' span');
            var nextActive = Array.prototype.slice.call(peoples, 0, count);
            var currentlyActive = _.filter(peoples, function (el) {
                return el.classList.contains('active');
            });
            var numberPlace = this.el.querySelector('.' + type + ' .large').innerHTML = count;
            // stop prev animations
            if (this.intervals) {
                _.each(this.intervals[type], function (el) {
                    clearTimeout(el);
                });
            } else {
                this.intervals = [];
            }
            this.intervals[type] = [];

            //off
            if (currentlyActive.length) {
                _.each(currentlyActive, function (el, index) {
                    this.intervals[type].push(setTimeout(function () {
                        el.classList.remove('active');
                    }.bind(this), this.speed * (currentlyActive.length - (index + 1))));
                }, this);
            }

            //on
            if (nextActive.length) {
                _.each(nextActive, function (el, index) {
                    this.intervals[type].push(setTimeout(function () {
                        el.classList.add('active');
                    }.bind(this), this.speed * (currentlyActive.length + index)));
                }, this);
            }



        },
        processPeople: function () {
            var numbers = this.model.get('counted');
            this.highligthPeople('man', numbers[0]);
            this.highligthPeople('women', numbers[1]);
        }
    });
    var Showreel = Backbone.View.extend({
        events: {
            "click .play": function () {
                if (this.video.paused) {
                    this.video.play();
                    this.el.classList.add('playing');
                } else {
                    this.video.pause();
                    this.el.classList.remove('playing');
                }
            },
            "click #about-showreel": function () {
                if (this.video.paused) {
                    this.video.play();
                    this.el.classList.add('playing');
                } else {
                    this.video.pause();
                    this.el.classList.remove('playing');
                }
            },
            "ended video": function () {
                this.el.classList.remove('playing');
            },
            "pause video": function () {
                this.el.classList.remove('playing');
            }
        },
        initialize: function (options) {
            this.setElement(options.parent.el.querySelector('.about-showreel'));
            this.video = this.el.querySelector('#about-showreel');
        }
    });
    var Profile = Backbone.View.extend({

        events: {
            'click': function () {
                if (Number(this.model.get('state')) === 0) {
                    this.model.set('state', 2);
                }
            },
            'submit': function (el) {
                el.preventDefault();
                return false;
            },
            'click .icon': function () {
                var progressBar = this.progressBar;
                if (Number(this.model.get('state')) === 2 && this.model.get('selected')) {
                    var formData = new FormData(this.el);
                    this.model.set('loading', 1);
                    $.ajax('http://bambus.com.ua/resumeMail/resumeMail.php', {
                        method: 'POST',
                        context: this,
                        data: formData,
                        xhr: function () {  // Custom XMLHttpRequest
                            var myXhr = $.ajaxSettings.xhr();
                            if (myXhr.upload) { // Check if upload property exists
                                myXhr.upload.addEventListener('progress', function (e) {
                                    progressBar.max = e.total;
                                    progressBar.value = e.loaded;

                                }, false); // For handling the progress of the upload
                            }
                            return myXhr;
                        },
                        success: function (data) {
                            if (parseInt(data, 10) === 1) {
                                this.model.set({state: 3, sended: 1, loading: 0});
                            } else {
                                this.model.set({state: 3, sended: 2, loading: 0});
                            }
                        },
                        error: function () {
                            this.model.set({state: 3, sended: 2, loading: 0});
                        },
                        cache: false,
                        contentType: false,
                        processData: false
                    });
                }
            },
            'change input': function () {
                this.model.set('selected', this.el.attachment.value.split('\\').pop());
            }
        },
        initialize: function (options) {
            this.model = new Backbone.Model({state: 0, sended: 0, selected: null});

            this.setElement(options.parent.el.querySelector('#submit-profile'));
            this.progressBar = this.el.querySelector('progress');
            this.listenTo(this.model, 'change:state', function () {
                this.el.className = 'state-' + this.model.get('state');
            });

            this.listenTo(this.model, 'change:loading', function () {
                if (Number(this.model.get('loading')) === 1) {
                    this.el.querySelector('button').disabled = true;
                } else {
                    this.el.querySelector('button').removeAttribute('disabled');
                }
            });

            this.listenTo(this.model, 'change:selected', function () {
                var filename = this.model.get('selected');
                if (filename) {
                    this.el.querySelector('label').innerHTML  = this.model.get('selected');
                } else {
                    this.el.querySelector('label').innerHTML  = this.el.attachment.placeholder;
                }
            });
            this.listenTo(this.model, 'change:sended', function () {
                var sended = this.model.get('sended');
                if (sended) {
                    this.el.classList.add((Number(this.model.get('sended')) === 1) ? 'success' : 'error');
                    setTimeout(function () {
                        this.el.reset();
                        this.progressBar.value = 0;
                        this.model.set({state: 0, sended: 0, selected: null});

                    }.bind(this), 5000);
                }
            });
        }
    });
    var Clients = Backbone.View.extend({
        initialize: function (options) {
            this.on('remove', function () {
                this.grid.destroy();
                delete this.grid;
            });
            this.setElement(options.parent.el.querySelector('.client-holder'));
            this.render();
        },
        render: function () {

            //clients grid
            this.grid = new Masonry(this.el, {
                columnWidth: '.client',
                itemSelector: '.client,.description-box',
                stamp: ".description-box"
            });

            return this;
        }
    });
    var Planets = Backbone.View.extend({
        events: {
            'mouseover .planet': "stop",
            'mouseout .planet': "start"
        },
        hideHint: function () {
            this.el.classList.remove('show-hint');

            this.hint.removeAttribute('style');
            this.text.innerHTML = this.text.dataset.text;
        },
        showHint: function (event) {
            this.el.classList.add('show-hint');
            var color = event.currentTarget.style.backgroundColor;
            var hint = this.hint;
            hint.style.background = color;
            
            clearInterval(this.clearHintBack);
            this.clearHintBack = setTimeout(function () {
                hint.style.background = 'none';
            }, 1000);
            this.text.innerHTML = event.currentTarget.dataset.text;
            this.addImage(event.currentTarget.dataset.img);
        },
        addImage: function (path) {
            var image = new Image();
            image.src = path;
            this.images.innerHTML = '';
            this.images.appendChild(image);
        },
        start: function (event) {
            this.el.classList.add('running');
            this.hideHint();
            this.el.classList.remove('stoped');
            document.getElementById('about').classList.remove('hidden');
        },
        stop: function (event) {
            this.el.classList.remove('running');
            this.showHint(event);
            this.el.classList.add('stoped');
            document.getElementById('about').classList.add('hidden');
        },
        initialize: function (options) {
            this.setElement(options.parent.el.querySelector('.solar-system'));
            this.hint = this.el.querySelector('.orbit[data-id="1"]');
            this.text = this.hint.querySelector('.text');
            this.images = this.hint.querySelector('.images');
            //this.render();
        },
        render: function () {
            this.el.classList.add('animating');
        }
    });
    var Panda = Backbone.View.extend({
        initialize: function (options) {
            this.model = new Backbone.Model({pandaFrameIndex: -1});
            this.on('remove', function () {
                this.wheel.unwheel();
            });
            this.listenTo(this.model, 'change', function () {
                this.el.src = '/pictures/about/panda/' + Math.min(9, this.model.get('pandaFrameIndex') * -1) + '.jpg';
            });
            this.setElement(options.parent.el.querySelector('.panda img'));
            this.render(options);
        },
        render: function (options) {
            //panda animations
            var panda = this.el;
            var model = this.model;
            var page = options.parent.el;
            var x;
            for (x = 1; x <= 9; x++) {
                (new Image()).src = '/pictures/about/panda/' + x + '.jpg';
            }
            function handler(event, delta, deltaX, deltaY) {
                var index = model.get('pandaFrameIndex');
                index += delta;
                if (index >= 0) {
                    model.set('pandaFrameIndex', -1);
                } else if (index > -13 && index) {
                    model.set('pandaFrameIndex', index);
                    if (delta < 0 && page.scrollTop <= window.innerHeight) {
                        event.preventDefault();
                    }
                } else if (index < -13) {
                    model.set('pandaFrameIndex', -13);
                    //wheel.unwheel(handler);
                }

            }

            this.wheel = hamster(window).wheel(handler, false);
        }
    });

    var About = Page.extend({
        name: 'about',
        events: {
            "scroll": function (event) {
                this.scrollHandler(event);
            },
            "click .intro .button": function () {
                var h = window.innerHeight;
                var t = 0;
                var interval = setInterval(function () {
                    var index = this.modules.panda.model.get('pandaFrameIndex');
                    if (index < -13) {
                        clearInterval(interval);
                        var elem = document.getElementById('about');
                        var animate = function () {
                            if (elem.scrollTop > h) {
                                elem.scrollTop = h;
                                return;
                            }
                            elem.scrollTop = h * (1 - Math.pow(1 - (t / 50), 5));
                            t++;
                            requestAnimationFrame(animate);
                        };
                        animate();
                        return;
                    }
                    this.modules.panda.model.set('pandaFrameIndex', index - 1);
                }.bind(this), 50);
            }
        },
        showHook: function () {
            if (preloader.loaded) {
                if (this.wow.element) {
                    this.wow.scrollCallback();
                } else {
                    this.wow.init();
                }
                this.modules.clients.grid.layout();
            } else {
                this.waiting = setTimeout(this.showHook.bind(this), 1000);
            }
        },
        initHook: function () {
            this.on('remove', function () {
                var name;
                if (this.wow) {
                    this.wow.stop();
                }
                clearTimeout(this.waiting);
                for (name in this.modules) {
                    if (this.modules.hasOwnProperty(name)) {
                        this.modules[name].remove().trigger('remove');
                        delete this.modules[name];
                    }
                }
                delete this.wow;
            });
            this.scrollHandler = (function (_self) {
                var icon = _self.el.querySelector('.scroll-icon');
                var planetLauncher = _.once(function (planets) {
                    planets.render();
                    setTimeout(planets.start.bind(planets), 10);
                });
                return _.throttle(function (event) {
                    var planets = _self.modules.planets;
                    if (planets.el.getBoundingClientRect().top < window.innerHeight / 1.2) {
                        planetLauncher(planets);
                    }
                    if (event.currentTarget.scrollTop >= 100) {
                        icon.classList.add('hidden');
                    } else {
                        icon.classList.remove('hidden');
                    }
                });
            }(this));
        },
        render: function () {
            // reveal animation 
            this.wow = new WOW({
                boxClass: 'wow', // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                offset: 50, // distance to the element when triggering the animation (default is 0)
                mobile: true, // trigger animations on mobile devices (true is default)
                root: this.el
            });

            this.modules = _.extend(this.widgets || {}, {
                slider: new Slider({parent: this, container: '.slider', slide: 'img'}),
                panda: new Panda({parent: this}),
                clients: new Clients({parent: this}),
                planets: new Planets({parent: this}),
                profile: new Profile({parent: this}),
                switcher: new Switcher({parent: this}),
                showreal: new Showreel({parent: this})
            });

            this.rendered = true;
            return this;
        }
    });
    return About;
});
