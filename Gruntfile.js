/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global module, require, __dirname */


module.exports = function (grunt) {
    'use strict';
    var http = require('http');
    var send = require('send');
    var url = require('url');
    // Project configuratasdion.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: '',
                    debug: true,
                    middleware: function (connect, options) {
                        // Return array of whatever middlewares you want
                        return [
                            //connect.static(options.base),
                            function (req, res, next) {

                                function error(err) {
                                    res.statusCode = err.status || 500;
                                    res.end('Error: ' + err.message);
                                }

                                // your custom directory handling logic:
                                function redirect() {
                                    res.statusCode = 301;
                                    res.setHeader('Location', req.url + '/');
                                    res.end('Redirecting to ' + req.url + '/');
                                }

                                // transfer arbitrary files from within
                                // /www/example.com/public/*
                                var path = url.parse(req.url).pathname;
                                
                                var staticFile = path.match(/.(js|ico|gif|jpg|png|css|html|swf|flv|xml|svg|php)$/);
                                if(!staticFile){
                                    path = 'index.html';
                                }
//                                if (path.search('.html') !== -1) {
//                                    console.log('direct');
//                                } else if (matchServices || matchPortfolio) {
//                                    console.log('REWRITE');
//                                    path = 'index.html';
//                                } else {
//                                    for (x = 0; x < __rewrite.length; x++) {
//                                        if (__rewrite[x] === path) {
//                                            console.log('REWRITE 2');
//                                            path = 'index.html';
//                                        }
//                                    }
//                                }
                                console.log(path);
                                send(req, path)
                                    .root(__dirname + '/app')
                                    .on('error', error)
                                    .index('index.html')
                                    .hidden(true)
                                    .on('directory', redirect)
                                    .pipe(res);
                            }
                        ];
                    }
                }
            }
        },
        watch: {
            templates: {
                files: ['app/templates/**/*.html', 'app/templates/**/*.json'],
                tasks: ['mustache_render'/*,'htmlmin'*/]
            },
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['sass:dist']
            },
            css: {
                files: ['temp/_app.css'],
                tasks: ['autoprefixer']
            }
        },
        mustache_render: {
            options: {
                directory: 'app/templates/partials',
                extension: '.html',
                prefix: ''
            },
            all: {
                files: [{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/_index.html',
                    dest: 'app/index.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/about.html',
                    dest: 'app/pages/about.html'
                },{
                    data: 'app/templates/data/en.json',
                    template: 'app/templates/partials/about.html',
                    dest: 'app/pages/en/about.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/contacts.html',
                    dest: 'app/pages/contacts.html'
                },{
                    data: 'app/templates/data/en.json',
                    template: 'app/templates/partials/contacts.html',
                    dest: 'app/pages/en/contacts.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/homepage.html',
                    dest: 'app/pages/home.html'
                },{
                    data: 'app/templates/data/en.json',
                    template: 'app/templates/partials/homepage.html',
                    dest: 'app/pages/en/home.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/preloader.html',
                    dest: 'app/pages/preloader.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/showreel.html',
                    dest: 'app/pages/showreel.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/services/web.html',
                    dest: 'app/pages/services-web.html'
                },{
                    data: 'app/templates/data/en.json',
                    template: 'app/templates/partials/services/web.html',
                    dest: 'app/pages/en/services-web.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/page404.html',
                    dest: 'app/pages/page404.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/nosupport.html',
                    dest: 'app/pages/nosupport.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/portfolio.html',
                    dest: 'app/pages/portfolio.html'
                },
                {
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/portfolio/20944173.html',
                    dest: 'app/pages/20944173.html'
                },{
                    data: 'app/templates/data/index.json',
                    template: 'app/templates/partials/portfolio/20379627.html',
                    dest: 'app/pages/20379627.html'
                }
            ]
            } 
        },
        sass: {
            dist: {
                options: {
                    output: "",
                    sourceMap: '../app/css/map.css',
                    includePaths: [
                        'app/bower_components/foundation/scss/'
                    ]
                },
                //Options for Sass compiler for Oleg do not delete please
//                options: {
//                    lineNumbers: true,
//                    sourcemap: '../app/css/map.css',
//                    loadPath: [
//                        'app/bower_components/foundation/scss/'
//                    ]
//                },
                
                files: {
                    'temp/_app.css': 'scss/app.scss'
                }
            }
        },
        autoprefixer: {
            single_file: {
                options: {
                    browsers: ['last 1 version']
                },
                src: 'temp/_app.css',
                dest: 'app/css/app.css'
            }
        },
        browser_sync: {
            files: {
                src: [
                    'app/index.html',
                    'app/js/**/*.js',
                    'app/css/app.css'
                ]
            },
            options: {
                host: 'localhost',
                reloadFileTypes: ['php', 'html', 'js', 'erb', 'svg'],
                injectFileTypes: ['css', 'png', 'jpg', 'svg', 'gif'],
                watchTask: true,
                debugInfo: true,
                ghostMode: {
                    scroll: false,
                    links: false,
                    forms: false,
                    clicks: false
                }

                //                server: {
                //                    baseDir: "",
                //                    index: "app/index.html"
                //                }
            }
        },
        modernizr: {

            dist: {
                // [REQUIRED] Path to the build you're using for development.
                "devFile": "remote",

                // [REQUIRED] Path to save out the built file.
                "outputFile": "app/js/app/modernizr-custom.js",

                // Based on default settings on http://modernizr.com/download/
                "extra": {
                    "shiv": true,
                    "printshiv": false,
                    "load": true,
                    "mq": false,
                    "cssclasses": true
                },

                // Based on default settings on http://modernizr.com/download/
                "extensibility": {
                    "addtest": false,
                    "prefixed": false,
                    "teststyles": false,
                    "testprops": false,
                    "testallprops": false,
                    "hasevents": false,
                    "prefixes": false,
                    "domprefixes": false
                },

                // By default, source is uglified before saving
                "uglify": true,

                // Define any tests you want to implicitly include.
                "tests": [],

                // By default, this task will crawl your project for references to Modernizr tests.
                // Set to false to disable.
                "parseFiles": true,

                // When parseFiles = true, this task will crawl all *.js, *.css, *.scss files, except files that are in node_modules/.
                // You can override this by defining a "files" array below.
                "files": {
                    "src": ['app/js/**/*.js']
                },

                // When parseFiles = true, matchCommunityTests = true will attempt to
                // match user-contributed tests.
                "matchCommunityTests": false,

                // Have custom Modernizr tests? Add paths to their location here.
                "customTests": []
            }

        },
        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
//                    removeComments: true
                },
                files: {                                   // Dictionary of files
                    'app/pages/about.html': 'app/pages/about.html',
                    'app/pages/contacts.html': 'app/pages/contacts.html',
                    'app/pages/home.html': 'app/pages/home.html',
                    'app/pages/portfolio.html': 'app/pages/portfolio.html',
                    'app/pages/preloader.html': 'app/pages/preloader.html',
                    'app/pages/showreel.html': 'app/pages/showreel.html',
                    'app/pages/services-web.html': 'app/pages/services-web.html'
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-mustache-render');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-sass');
    //sass compiler For Oleg do not remove pleae 
//    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks("grunt-modernizr");
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.event.on('watch', function (action, filepath, target) {
        grunt.config.set('myFile', filepath);
        grunt.config.set('_myFile', filepath.replace(/\\/g, '/'));
        console.log(filepath.replace(/\\/g, '/'));
    });


    // Default task(s).
    grunt.registerTask('default', ['connect', 'browser_sync', 'sass', 'watch']);

};
