/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _, mina */

define([
    'page',
    'backbone',
    'wow',
    'helper',
    'preloader',
    'slider',
    'triangles'
], function (
    Page,
    Backbone,
    WOW,
    helper,
    preloader,
    Slider,
    Triangles
) {

    'use strict';
    helper.loadCss('/bower_components/wow/css/libs/animate.css','animate-styles');
        
        
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
                "ended video": function () {
                    this.el.classList.remove('playing');
                },
                "pause video": function () {
                    this.el.classList.remove('playing');
                }
            },
            initialize: function (options) {
                this.setElement(options.parent.el.querySelector('.showreel'));
                this.video = this.el.querySelector('#about-showreel');
            }
        });    
        
        
        
        
    var Web = Page.extend({
        name: 'services-web',
        events: {
            "click .intro .button": function () {
                var h = window.innerHeight;
                var t = 0;
                var elem = this.el;
                var animate = function () {
                    if(elem.scrollTop>h){
                        elem.scrollTop = h;
                        return;
                    }
                    elem.scrollTop = h * (1 - Math.pow(1 - (t / 50), 5));
                    t++;
                    requestAnimationFrame(animate);
                }
                animate();
            },
            "click #panda-lines": function () {
                //this.modules.panda.exit();
            },
            "scroll": function (event) {
                this.scrollHandler(event);
            }
        },
        showHook: function () {
            if(preloader.loaded){
                if(this.wow.element){
                    this.wow.scrollCallback();
                }else{
                    this.wow.init();
                }
                this.modules.panda.start();
            }else{
                setTimeout(this.showHook.bind(this),1000);
            }
        },
        render: function () {

            this.modules = this.modules||{};
            var CustomSlider = Slider.extend({
                bulletsUpdateState:function(){
                    var currentBulletIndex = this.getCurrentSlide();
                    // reset bulltes
                    if (currentBulletIndex == 2) {
                        this.stop();
                    }
                    this.bullets.forEach(function(el, index){
                        if(index > currentBulletIndex){
                            el.classList.remove("active", "passed");
                        } else if (index == currentBulletIndex) {
                            el.classList.remove("passed");
                            el.classList.add('active');    
                        } else {
                            el.classList.add('active','passed');
                        }
                    })
                    // higligth bullet
                    
                }
            })
            // reveal animation
            this.modules.panda = new Triangles({
                canvasId:'panda-lines', 
                src:'/pictures/services/web/panda.png',
                maxLineDistance: 40,
                maxLineDistance2: 46,
                counterValue: 1
            });
            
            this.modules.lines = new Triangles({
                canvasId:'bamboo-lines', 
                src:'/pictures/services/web/footer.png',
                maxLineDistance: 25,
                static: true,
                maxLineDistance2: 25,
                counterValue: 1.5
            });
            
            this.modules.process = new (Backbone.View.extend({
                events: {
                    'click .step': function (event) {
                        var currentIndex;
                        this.steps.forEach(function (step, index) {
                            if (event.currentTarget === step){
                                currentIndex = index;
                            }
                        });
                        this.steps.forEach(function (step, index) {
                            console.log(currentIndex , index)
                            if (currentIndex < index){
                                step.classList.remove('active','passed');
                                step.querySelector('.connector').classList.remove('active');
                            } else if (currentIndex == index) {
                                step.classList.add('active');
                                step.querySelector('.connector').classList.remove('active');
                            } else {
                                step.classList.add('active','passed');
                                step.querySelector('.connector').classList.add('active');
                            }
                            if(currentIndex == 5 ){
                                step.querySelector('.connector').classList.add('active');
                            }
                        });
                    }
                },
                model: new Backbone.Model(),
                start: function () {
                    var steps = this.steps;
                    setTimeout(function () {
                        steps[0].classList.add('active', 'passed');
//                        steps[1].classList.add('active', 'passed');
//                        steps[2].classList.add('active', 'passed');
//                        steps[3].classList.add('active', 'passed');
//                        steps[4].classList.add('active', 'passed');
//                        steps[5].classList.add('active', 'passed');
                    }, 2500);
                },
                initialize: function (options) {
                    this.setElement(options.parent.el.querySelector(options.selector));
                    var steps = this.steps = Array.prototype.slice.call(this.el.querySelectorAll('.step'));
                }
            }))({
                parent: this,
                selector: '.graph'
            });
            this.modules.slider = new CustomSlider({
                container:'.switcher',
                slide:'.slide',
                parent: this,
                autoplay: false,
                delay: 2000
            })
            
            
            this.wow = new WOW({
                boxClass: 'wow', // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                offset: 50, // distance to the element when triggering the animation (default is 0)
                mobile: true, // trigger animations on mobile devices (true is default)
                root: this.el
            });
            
            
            this.showreel = new Showreel({parent:this});

            this.rendered = true;
            
            this.scrollHandler = (function (_self) {

                var lines = _self.modules.lines,
                    slider = _self.modules.slider,
                    panda = _self.modules.panda,
                    process = _self.modules.process,
                    icon = _self.el.querySelector('.scroll-icon');
                var runSlider = _.once(function () {slider.start();})
                var runProcess = _.once(function () {process.start();})
                var runLines = _.once(function () {lines.start();})
                return  _.throttle(function (event) {
                    if(event.currentTarget.scrollTop >= 100){
                        icon.classList.add('hidden');
                        panda.exit();
                    } else {
                        icon.classList.remove('hidden');
                        panda.start();
                    }
                    if (slider.el.getBoundingClientRect().top < 400) {
                        runSlider();
                    }
                    if (process.el.getBoundingClientRect().top < 400) {
                        runProcess();
                    }
                    if (lines.canvas.getBoundingClientRect().top < 400) {
                        runLines();
                    }
                },300);
            })(this);
            
            return this;
        }
    });
    return Web;
});
