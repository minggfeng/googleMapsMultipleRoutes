'use strict';

class Locations {
  constructor(map) {
    this.locations = [];
    this.info = {};
    this.map = map;
    this.parentElement;
    this.bounds = new google.maps.LatLngBounds();
  }
}

Locations.prototype.createLocationEntry = function(location) {
  let locationEntry = document.createElement('div');
  locationEntry.classList.add('location_entry');
  locationEntry.setAttribute('locid', location.id);
  locationEntry.draggable = true;
  locationEntry.ondragstart = (e, addLocation) => { this.onDragStart(e, true); };
  let content = `
    <div class=map"location_entry_content">
      <div class="location_name">${location.name}</div>
      <div>${location.formatted_address}</div>
      <div class="location_entry_expand">
  `;

  if (location.rating) {
    content += `<div>Rating: ${location.rating}</div>`;
  }
  if (location.opening_hours) {
    content += `<div>Open now: ${location.opening_hours.open_now}</div>`
  }
  if (location.price_level) {
    content += `<div>Price level: ${location.price_level}</div>`
  }

  content += `</div></div>
    <div class="remove">
      <i class="close material-icons md-dark" title="Remove">close</i>
    </div>`

  locationEntry.innerHTML = content;
  locationEntry.onclick = (e, locId, context) => { this.expand(e, location.id, this) }
  return locationEntry;
}

Locations.prototype.createSingleMarker = function(location) {
  let lat = location.geometry.location.lat();
  let lng = location.geometry.location.lng();
  let latlng = new google.maps.LatLng(lat, lng);

  let marker = new google.maps.Marker({
    map: this.map.map,
    title: location.name,
    position: latlng,
    id: location.id,
    address: location.formatted_address
  });

  if (location.icon) {
    let icon = {
      url: location.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    marker.icon = icon;
  }

  marker.addListener('click', (e, locId, context) => { this.expand(e, location.id, this) });
  
  this.bounds.extend(latlng);
  this.map.map.fitBounds(this.bounds);
  this.map.map.panToBounds(this.bounds);
  return marker;
}


Locations.prototype.addLocation = function(parentElement, location) {
  if (this.parentElement === undefined) {
    this.parentElement = parentElement;
  }
  let locationEntry = this.createLocationEntry(location);
  let marker = this.createSingleMarker(location);
  this.info[location.id] = this.locations.length;
  parentElement.appendChild(locationEntry);
  let locationData = { location: location, element: locationEntry, marker: marker };
  this.locations.push(locationData);
  return locationData;
}

Locations.prototype.onDragStart = function(e, addLocation) {
  e.stopPropagation();
  if (e.target.getAttribute('locid')) {
    let text = `${e.target.getAttribute('locid')},${addLocation}`;
    e.dataTransfer.setData("text", text);
  } else {
    return;
  }
}

Locations.prototype.addResults = function(results) {
  this.clearLocations();
  sidebarHelpers.expand();
  results.forEach(location => this.addLocation(locationsDiv, location));
  if (!closeButton.classList.contains('close_active')) {
    closeButton.classList.add('close_active');
  }
}

Locations.prototype.expand = function(e, locId, context) {
  if (e.target && e.target.classList.contains('close')) return;
  let locationIndex = context.info[locId];
  let locationElement = context.locations[locationIndex].element;
  let locationEntryExpand = locationElement.querySelector('.location_entry_expand');
  let marker = context.locations[locationIndex].marker;
  locationEntryExpand.classList.toggle('location_entry_expand_active');
  locationElement.classList.toggle('location_selected');
  if (locationEntryExpand.classList.contains('location_entry_expand_active')) {
    let latlng = new google.maps.LatLngBounds(marker.position);
    this.map.resetBounds(latlng);
    setScrollTop(this.parentElement, locationElement);
  } else {
    this.map.resetBounds(this.bounds);
  }
}

Locations.prototype.clearLocations = function() {
  this.removeMarkers();
  this.locations = [];
  this.info = {};
  this.bounds = new google.maps.LatLngBounds();
  this.map.resetBounds();
}

Locations.prototype.removeMarkers = function() {
  this.locations.forEach(location => {
    location.marker.setMap(null);
  })
}

