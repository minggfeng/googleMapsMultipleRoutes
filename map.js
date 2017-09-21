'use strict'

class Map {
  constructor(searchText, latlng, zoom) {
    this.zoom = zoom || 15;
    this.currentPosition = latlng || new google.maps.LatLng(37.7541641, -122.47675710000001);

    this.map = new google.maps.Map(mapDiv, {
      zoom: this.zoom,
      center: this.currentPosition,
      mapTypeControl: false
    });

    this.service = new google.maps.places.PlacesService(this.map);

    this.directionsService = new google.maps.DirectionsService();

    this.autocomplete = new google.maps.places.Autocomplete(searchText);

    this.bounds = new google.maps.LatLngBounds();
    this.bounds.extend(this.currentPosition);

    this.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: false,
      map: this.map,
    });

  }
}

Map.prototype.resetBounds = function(bounds) {
  bounds = bounds || this.bounds;
  this.map.fitBounds(bounds);
  this.map.panToBounds(bounds);
}

Map.prototype.resizeMap = function(context) {
  context = context || this;
  let bounds = context.map.getBounds();
  google.maps.event.trigger(context.map, "resize");
  context.resetBounds(bounds);
}

