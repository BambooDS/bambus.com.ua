/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _ */

define(['portfolio_collection', 'page',  'echo', 'backbone','underscore','helper', 'app', 'preloader'], function (Collection, Page, Echo, Backbone, _, helper,app, preloader) {
    'use strict';
    

    var Portfolio = Page.extend({
        name: 'portfolio',
        events: {
            'click .portfolio-filters button': function (event) {
                Array.prototype.forEach.call(this.el.querySelectorAll('.portfolio-filters button'), function(el){
                    el.classList.remove('active');    
                },this);
                var filter = event.target;
                
                if(this.model.get('tag') == filter.dataset.filter){
                    this.model.set({
                        'tag': ''
                    });
                    return false;
                }
                
                filter.classList.add('active');
                this.model.set({
                    'tag': filter.dataset.filter
                });
            }, 
            'scroll': function () {
                if(this.pool){
                    clearTimeout(this.pool);
                }
                this.pool = setTimeout(function(){
                    //get codrinates of last visible item
                    var lastItem = this.collection.last().view.el;
                    var coords = lastItem.getBoundingClientRect();
                   
                    
                    if((coords.top>=0&&coords.left>=0&&coords.top)<=(window.innerHeight||document.documentElement.clientHeight)+parseInt(200)){
                        //if it on screen that load additional items
                        clearTimeout(this.pool)
                        this.collection.loadNextPage();    
                    }    
                }.bind(this), 500);
            }
        },
        initHook: function () {
            this.collection = new Collection([],{view:this});
            this.model = this.collection.state;
        },
        
        render: function () {
            this.rendered = true;
            this.list = this.el.querySelector('#porfolio-list');
            this.echo = new Echo({
                offset: 100,
                throttle: 250,
                root: this.el
            });
            return this;
        }
    });

    
    return Portfolio;
});
