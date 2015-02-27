/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone */

define(['modernizr-custom', 'helper', 'backbone','preloader', 'underscore'],
    function (Modernizr, helper, Backbone, preloader, underscore) {
        'use strict';
        var model  = Backbone.Model.extend({
            
        })
        var slider = Backbone.View.extend({
            events: {
                'click .bullets>div':function(event){
                    this.stop();
                    this.changeSlides(parseInt(event.currentTarget.dataset.index));
                }    
            },
            initialize: function (options) {
               this.on('remove', function () {
                   this.stop();
               });


                this.transitions = true;
                this.activeClass = "active";
                this.running = false;
                this.delay = options.delay||5000;
                this.currentSlide = 0;
                this.options = options;
                this.autoplay = true;
                if (typeof options.autoplay != 'undefined') {
                    this.autoplay = options.autoplay;
                } else {
                    this.autoplay = true;
                }
                this.parent = options.parent;
                console.log(this.parent.el)
                this.container = this.parent.el.querySelector(options.container);
                
                this.slides = this.container.querySelectorAll(options.slide);
                
                this.container.classList.add('loaded');
                
                this.setElement(this.container);            
                
                if (this.getSlidesCount < 2) {
                    return false;
                }
                // if called not as first page
                if(preloader.loaded){
                    this.render();
                }else{
                    //caled as first page  - so wait till page loads
                    preloader.dispatcher.on('loaded',this.render,this);    
                }
                
                
                this.on('slideChange', this.bulletsUpdateState, this);
                
            },
            render: function () {
                console.log('render slider');
                this.generateBullets();
                this.slides[this.currentSlide].classList.add('active');
                this.trigger('slideChange');

                if(window.picturefill) {
                    window.picturefill( {
                        elements: [this.el]
                    });
                }

                // TODO check home page
                if (this.autoplay) {
                    this.start();
                }
            },
           
            getSlidesCount: function () {
                return this.slides.length;
            },
            getNextSlide: function (index) {
                if(typeof(index)!== 'undefined'){
                    this._setCurrentSlide(index);
                    return this.getCurrentSlide(); //return NEW current slide
                }
                if (this.getCurrentSlide() === this.getSlidesCount() - 1) {
                    this._setCurrentSlide(0);
                    return 0;
                } else {
                    this._setCurrentSlide(this.getCurrentSlide() + 1); //update current slide index
                    return this.getCurrentSlide(); //return NEW current slide
                }
            },
            getCurrentSlide: function () {
                return this.currentSlide;
            },
            _setCurrentSlide: function (currentSlide) {
                this.currentSlide = currentSlide;
            },
            
            generateBullets: function(){
                if (this.el.querySelectorAll('.bullets>div').length > 0 ){
                    this.bullets = Array.prototype.slice.call(this.el.querySelectorAll('.bullets>div'));
                    this.bullets.forEach(function (bullet, index) {
                        bullet.dataset.index = index;    
                    });
                } else {
                    var bullet;
                    this.bullets = this.bullets || [];
                    var bullets = document.createElement('div');
                    bullets.className = 'bullets hide-for-small';
                    for (var counter = this.slides.length, index = 0; counter > 0; counter--, index++) {
                        bullet = document.createElement('div');
                        bullet.dataset.index = index;
                        //bullet.addEventListener('click', sliderBulletHandler, false);
                        this.bullets.push(bullet) 
                        bullets.appendChild(bullet);
                    }
                    this.el.appendChild(bullets);    
                }
                
                
            },
            bulletsUpdateState:function(){
                // reset bulltes
                this.bullets.forEach(function(el){
                    el.classList.remove('active');
                })
                // higligth bullet
                this.bullets[this.getCurrentSlide()].classList.add('active');
            },


            // img slider
            showSlide: function (slide) {
                slide.classList.add('active');
                //slide.style.zIndex = 2; // push top in case if this a first slide
                
            },
            hideSlide: function (slide) {
                slide.classList.remove('active');
                slide.classList.add('out');
            },
            
            changeSlides: function (nextIndex) {
                var currentIndex = this.getCurrentSlide();
                
                if (currentIndex === nextIndex || this.animating ) {
                    return false;
                }
                
                this.animating = true;

                var currentSlide = this.slides[currentIndex];
                
                var nextSlide = this.slides[this.getNextSlide(nextIndex)];
                // it wants work if there is no tranition on items
                if (this.transitions) {
                    nextSlide.addEventListener(helper.transEndEventName, function transEndHandler(event) {
                        if(event.propertyName.indexOf('transform') > -1 && event.target.classList.contains('active')){
                            nextSlide.style.zIndex = ''; // push top in case if this a first slide
                            this.animating = false;
                            nextSlide.removeEventListener(helper.transEndEventName, transEndHandler, false);
                        }
                    }.bind(this), false);
                    nextSlide.style.zIndex = '2';
                    _.each(this.slides, function (el) {
                        el.classList.remove('out');
                    });
                    this.hideSlide(currentSlide);
                    this.showSlide(nextSlide);
                    this.trigger('slideChange');
                }
            },
            start: function () {
                this.running = true;
                this.timer = setInterval(function () {
                    if(this.running){
                        this.changeSlides();
                    }
                }.bind(this), this.delay);
            },
            stop: function () {
                clearInterval(this.timer);
                this.running = false;
            }
        });
        return slider;
        
    });
