/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone, document, _, google */

define(['page', 'backbone', 'async!http://maps.google.com/maps/api/js?v=3&libraries=places&sensor=true&language=uk'], function (Page, Backbone) {
    'use strict';
    var Contact = Page.extend({
        'events': {
            'click button': 'getRoute',
            'change [name="map-input-start"]': 'getRoute',
            'change [name="map-input-mode"]': function () {
                var form = document.forms['map-input-form'];
                var start = form['map-input-start'].value;
                if (start) {
                    this.getRoute();
                }
            }
        },
        name: 'contacts',
        
        location: [ 49.829083, 23.994603],
        // TODO stop and run slider on page show
        getRoute: function () {
            var form = document.forms['map-input-form'];
            var start = form['map-input-start'].value;
            var mode = form['map-input-mode'].value;
            
            var icoSvgBig = {
                size: new google.maps.Size(34, 45),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(34/2, 45),
                path: 'M33.059 14.517c-1.005-8.913-9.045-15.326-17.959-14.321s-15.326 9.046-14.321 17.959c.337 2.994 1.482 5.694 3.174 7.938l11.369 17.866c.369.62 1.039 1.041 1.813 1.041.726 0 1.366-.366 1.746-.923.014-.014 12.02-19.445 11.989-19.458 1.748-2.939 2.602-6.442 2.189-10.102zm-15.361 8.728c-3.816.431-7.259-2.314-7.688-6.13-.431-3.816 2.314-7.259 6.13-7.688 3.816-.43 7.259 2.314 7.688 6.131.43 3.815-2.314 7.257-6.13 7.687z',
                fillColor: '#8BB22B',
                fillOpacity: 1,
                scale: 1,
                strokeColor: '#fff',
                strokeWeight: 0
            };
           
            var request = {
                origin: start,
                destination: this.location.join(','),
                travelMode: google.maps.TravelMode[mode]
            };
            
            this.routeService.route(request, function (result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.route.setDirections(result);
                }
                if (result.routes.length > 0) {
                    var myRoute = result.routes[0].legs[0];
                    if (this.start) {
                        this.start.setMap(null);
                        this.start = null;
                    }
                    this.start = new google.maps.Marker({
                        position: myRoute.steps[0].start_point,
                        map: this.map,
                        animation: google.maps.Animation.NONE,
                        icon: icoSvgBig
                    });
                }
            }.bind(this));
        },
        setStudioMarker: function () {
            var icoSvgBig = {
                size: new google.maps.Size(98, 92),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(98/2, 92),
                path: 'M93.431 21.968c-1.961-1.01-3.65-1.525-5.702-2.315-4.921-1.598-12.654-1.252-15.311-1.698.065-.127.149-.234.233-.341 5.959-4.118 12.422-7.597 18.489-11.638.561-.411 1.033-.693 1.227-1.304-2.164.468-4.209 1.463-6.529 1.704-3.04.949-6.024 1.895-8.821 3.253-1.605.779-3.15 1.694-4.608 2.825-.392.822-.892 1.681-1.582 2.016-.098.048-.201.085-.307.11-4.013.93-6.579 1.245-9.361 2.596-1.479.717-3.016 1.726-4.866 3.275l-1.445-1.676c3.699-4.238 5.371-10.934 10.238-15.093 2.622-2.02 1.256-1.301 2.41-3.308-.281-.224-.581-.201-.882-.055-.534.259-1.067.906-1.503 1.236-5.036 3.159-10.55 9.346-12.462 14.489l-1.756 7.002c-1.782-.179-3.609-.178-5.461.031-14.081 1.587-24.209 14.289-22.622 28.37.527 4.675 2.285 8.908 4.905 12.428l18.252 28.68c1.561 1.523 4.059 1.493 5.582-.067l18.677-30.28c.362-.52.327-.563.077-.436 2.803-4.664 4.155-10.249 3.499-16.073-.108-.955-.271-1.89-.479-2.806.33.092.73.237 1.234.456 4.665-.473 4.089 2.897 10.336 4.33 2.12-.096 3.079 1.552 3.729 1.236l.102-.067c-1.709-5.497-13.569-9.894-17.321-11.448-.125-.259-.255-.514-.388-.767 3.949-1.591 10.95.519 14.819 2.015.813.702 1.908 1.54 2.416 1.803 1.529-.408 2.278 1.013 3.694.985-5.173-6.225-10.288-12.017-16.444-17.226-.171-.239-.341-.478-.516-.679 6.577 1.628 12.811-.27 18.405-.253 2.231.007 3.307.335 3.795.098l.145-.103c-.099-.968-3.141-1.117-3.898-1.305zm-43.636 39.407c-7.311.824-13.905-4.434-14.729-11.746-.825-7.311 4.434-13.905 11.745-14.729 7.312-.824 13.906 4.435 14.731 11.746.823 7.31-4.435 13.905-11.747 14.729zm15.585-38.412c-.616.719-1.228 1.437-1.885 1.755l-.112.051c-.695-.14-3.2-.801-3.686-.565l-.042.027c-.183-.088-.363-.178-.548-.229 1.289-.913 2.73-1.687 4.215-2.408.781-.379 1.573-.743 2.361-1.105.789-.362 1.573-.723 2.338-1.094.362-.176.72-.354 1.071-.536.85-.276 1.028.735 1.144 1.365l-.096.038c-.677.328-.741 1.731-.751 3.107-.008 1.376.039 2.725-.414 2.945l-.077.025c-1.246-1.14.031-5.001-.749-5.325-.295-.022-.578.046-.853.18-.678.328-1.298 1.05-1.916 1.769zm5.789 8.653c-.892.433-1.91.623-2.96.773-.396-.487-.806-.962-1.235-1.417 2.004-.778 4.152-1.51 4.839.271-.206.141-.421.264-.644.373z',
                fillColor: '#96B03C',
                fillOpacity: 1,
                scale: 1,
                strokeColor: '#fff',
                strokeWeight: 0
            };
            this.finish = new google.maps.Marker({
                icon: icoSvgBig,
                position: new google.maps.LatLng(this.location[0], this.location[1]),
                map: this.map,
                animation: google.maps.Animation.DROP
            });
        },
        render: function () {
            /* autocomplete */
            var autocomplete = new google.maps.places.Autocomplete(document.forms['map-input-form']['map-input-start']);
            google.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace();
                this.getRoute();
            }.bind(this));
            
            /* options */
            var mapOptions = {
                center: new google.maps.LatLng(49.829083, 23.994603),
                zoom: 16,
                zoomControl: false,
                disableDoubleClickZoom: true,
                mapTypeControl: false,
                scaleControl: false,
                panControl: false,
                scrollwheel: true,
                streetViewControl: false,
                draggable: true,
                overviewMapControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            
            /* style */
            var styles = [
                {
                    stylers: [
                        { hue: "#00ffe6" },
                        { saturation: -20 }
                    ]
                }, {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        { lightness: 100 },
                        { visibility: "simplified" }
                    ]
                }, {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ];
            var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
            
            
            /* set-up map */
            this.mapElement = document.getElementById('map');
            this.map = new google.maps.Map(this.mapElement, mapOptions);
            this.map.mapTypes.set('map_style', styledMap);
            this.map.setMapTypeId('map_style');
            
            /* set-up routing helper */
            this.route = new google.maps.DirectionsRenderer({
                map: this.map,
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: '#96b03c',
                    strokeOpacity: 0.7,
                    strokeWeight: 6
                }
            });
            this.routeService = new google.maps.DirectionsService();
            
            /* add marker when map loaded */
            google.maps.event.addListenerOnce(this.map, 'idle', this.setStudioMarker.bind(this));
            this.rendered = true;
        }
    });
    return Contact;
});
