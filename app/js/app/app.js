/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, requirejs */


define(['backbone', 'preloader', 'menu'], function (Backbone, preloader, Menu) {
    'use strict';
    var application,
    App = Backbone.Router.extend({
        rewrites: {
            projects: {}
        },
        projectPages: {},
        initialize: function () {
            var _self = this;
            /* prevent defaults */
            document.documentElement.addEventListener('click', function (event) {
                var target = event.target;
                while (target && target.nodeName !== 'A') {
                    target = target.parentNode;
                }
                if (target) {
                    if (target.hostname === window.location.hostname) {
                        event.preventDefault();
                        _self.navigate(target.pathname, true);
                    }
                }
            }, true);
            
            /* save current state */
            this.currentPage = {
                path: 'home',
                params: []
            };

            this.on("route", function (route, params) {
                /* save current state */
                this.currentPage = {
                    path: ((route !== '/') ? route.split('/')[0] : "home"),
                    params: params
                };
            }.bind(this));
            
            /* start history */
            Backbone.history.start({pushState: true});
        },
        widget: {
            menu: new Menu()
        },
        pages: {},
        routes: {
            "": "home",
            "/": "home",
            "about": "about",
            "contacts": "contacts",
            "showreel": "showreel",
            
            "portfolio": "portfolio",
            "portfolio/:project": "project",
            
            "services": "services",
            "services/:service": "service",
            
            "*notFound": "notFound"
            
        },
        home: function () {
            requirejs(['homepage'], function (Home) {
                new Home();
            });
        },
        about: function () {
            requirejs(['about'], function (About) {
                new About();
            });
        },
        service: function (page) {
			//check if page module file exist, prevent 404 error
			if(page === 'web'){
				requirejs(['service-' + page], function (Service) {
					new Service();
				})
			} else {
				this.navigate('notFound', { trigger: true });
			}
        },
        portfolio: function () {
            requirejs(['portfolio'], function (Portfolio) {
                new Portfolio();
            });
        },
        project: function (slug) {
            var self = this;
            requirejs(['project'], function (Project) {
                self.projectPages[slug] = new Project({id: self.rewrites.projects[slug], name: slug});
            });
        },
        contacts: function () {
            requirejs(['contacts'], function (Contacts) {
                new Contacts();
            });
        },
        showreel: function () {
            requirejs(['showreel'], function (Reel) {
                new Reel();
            });
        },
        notFound: function () {
            requirejs(['page404'], function (Notfoundpage) {
                new Notfoundpage();
            });
            $('#preloader').hide();
         }
    });
    application = new App();
    return application;


});


