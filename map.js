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

    this.directionsDisplay = new google.maps.DirectionsRenderer({
      draggable: false,
      map: this.map,
    });
  }
}

Map.prototype.resetBounds = function(latlng) {
  latlng = latlng || this.currentPosition;
  this.bounds = new google.maps.LatLngBounds();
  this.bounds.extend(latlng);
  this.map.fitBounds(this.bounds);
  let center = this.map.getCenter();
}

Map.prototype.resizeMap = function() {
  let center = this.map.getCenter();
  google.maps.event.trigger(this.map, "resize");
  this.map.fitBounds(this.bounds);
  this.map.setCenter(center); 
}
