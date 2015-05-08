/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _ */
//'text!/bower_components/isotope/jquery.isotope.min.js'
define(['app', 'backbone', 'underscore', 'helper', 'preloader', 'isotope'], function(app, Backbone, _, helper, preloader, isotope) {

    'use strict';


    var ProjectView = Backbone.View.extend({
        template: _.template('<div class="visible item-block <% _.each(fields, function (tag){ tag = %><%= tag%> <%})%>" id="work_<%= id %>">' +
                '<a href="/portfolio/<%= id %>">' +
                '<span class="front-wrapper">' +
                '<img src="" data-echo="<%= covers["404"] %>">' +
                '</span>' +
                '<span class="back">' +
                '<span class="desc">' +
                '<span class="title"><%= name %></span>' +
                '</span>' +
                '</span>' +
                '</a>' +
                '</div>'),
        initialize: function(opt) {
            this.model.on('remove', this.remove, this);
            this.parentView = opt.parentView;
            var temp = document.createElement('div');
            temp.innerHTML = this.template(this.model.attributes);
            this.setElement(temp.removeChild(temp.firstChild));
            temp = null;
            $('#porfolio-list').isotope({
                itemSelector: '.item-block',
                layoutMode: 'fitRows'
            });
            this.render();
        },
        render: function() {
            this.parentView.list.appendChild(this.el);
            this.parentView.echo.add(this.el.querySelector('img'));

        }
    });

    var ProjectModel = Backbone.Model.extend({
        viewModel: ProjectView,
        initialize: function(attributes, opt) {
            this.set('slug', this.get('name').toLowerCase().replace(/\s/g, "-").replace(/("|')/g, ""));

            // add path to rewrite
            app.rewrites.projects[this.get('slug')] = this.get('id');
            this.view = new this.viewModel(_.extend(opt, {model: this}));
        }
    });


    var Projects = Backbone.Collection.extend({
        //helper to render project anywhere
        _sinle_module: ProjectModel,
        model: ProjectModel,
        url: function() {
            var endPoint = 'http://www.behance.net/v2/users/bambus_studio/projects';
            var apiKey = 'hiHNrEFZrHRZ6cZogKANRsMayAibW07s';
            var server = 'http://bambus.com.ua';
            var action = 'lib/getProjectsBehance.php?urlProjects';
            
          return server + '/' + action + '=' + encodeURIComponent(endPoint + '?api_key=' + apiKey + '&per_page=' + this.state.get('itemsPerPage') + '&field=' + this.state.get('tag')  );
        },
        initialize: function(models, opt) {
            this.state = new Backbone.Model({
                page: null,
                tag: '',
                itemsPerPage: 24
            });

            this.view = opt && opt.view;
            this.state.on('change:page', this.load, this);
            this.state.on('change:tag', this.resetState, this);
            this.loadPage(0);
        },
        loadPage: function(page) {
            this.state.set({page: page});
            return this;
        },
        loadNextPage: function() {
            this.state.set({
                page: this.state.get('page') + 1
            });
        },
        load: function() {

            if (!preloader.loaded) {
                preloader.push('portfolio', false);
            }
            Backbone.sync('read', this, {
                context: this,
                success: function(data) {
                    data.projects.forEach(function(project) {
                        this.add(project, {
                            parentView: this.view
                        });
                    }, this);
                    this.trigger('loadFinised');

                    setTimeout(function() {
                        preloader.done('portfolio');
                    }, 500);
                },
                error: function() {
                    throw new Error("Network Error");
                }
            });
        },
        resetState: function() {
//            console.log('resetting');
            this.remove(this.models);
            this.loadPage(0).load();
        }
    });

    return Projects;
});
