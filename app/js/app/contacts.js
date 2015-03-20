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
                        icon: 'img/marker-small.svg'
                    });
                }
            }.bind(this));
        },
        setStudioMarker: function () {
            this.finish = new google.maps.Marker({
                icon: 'img/contacts/pointer-big.svg',
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
