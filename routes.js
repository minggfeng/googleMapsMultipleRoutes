class Route extends Locations {
  constructor(index) {
    super(map, index);
    this.routeDiv = null;
    this.size = 0;
    this.alertDiv = null;
    this.index = index;
    this.results;
    this.polyline;
    this.color= "#F00";
    this.map = map;
  }
}

Route.prototype.newRouteDiv = function() {
  let newRouteDiv = document.createElement('div');
  newRouteDiv.classList.add('route_entry');
  newRouteDiv.draggable = false;
  newRouteDiv.ondragover = this.onDragOver;
  newRouteDiv.ondrop = (e, context) => { this.onDrop(e, this) };
  newRouteDiv.innerHTML = `
    <div>
      <i class="remove material-icons md-dark" title="Remove">close</i>
    </div>
    <div class="alert"></div>
    <div class="route_info">
      <div class="block">
        <div title="Select route"><input class="checkbox" type="checkbox" checked></div>
        <div class="duration"></div>
        <div class="distance"></div>
      </div>
      <div class="block">
        <div class="color" color="#F00"></div>
        <div class="color color_inactive" color="#00F"></div>
        <div class="color color_inactive" color="#0F0"></div>
      </div>
    </div>
  `;
  return newRouteDiv;
}

Route.prototype.newRoute = function() {
  let newRouteDiv = this.newRouteDiv();
  newRouteDiv.onclick = (e, context) => { this.handleClick(e, this) };
  routesDiv.appendChild(newRouteDiv);
  this.routeDiv = newRouteDiv;
  this.alertDiv = this.routeDiv.querySelector('.alert');
}

Route.prototype.getDirections = function(travelMode) {
  let points = this.locations.map(location => {
    let lat = location.location.geometry.location.lat();
    let lng = location.location.geometry.location.lng();
    let latlng = new google.maps.LatLng(lat, lng);
    return {
      location: latlng
    }
  });

  let options = {
    origin: points[0].location,
    destination: points[points.length - 1].location,
    travelMode: travelMode,
  }
  if (points.length > 2) {
    options.waypoints = points.slice(1, points.length - 1);
  }

  this.map.directionsService.route(options, (res, status) => {
    this.handleDirections(res, status);
  });
}

Route.prototype.handleDirections = function(res, status) {
  if (status === "OK") {
    this.resetPolyline();
    this.polyline = new google.maps.Polyline({
      path: res.routes[0].overview_path,
      geodesic: true,
      strokeColor: this.color || '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.polyline.setMap(this.map.map);
    this.directions = new google.maps.DirectionsRenderer({
      draggable: false,
      map: this.map.map,
    });
    this.results = res;
    let [distance, duration] = res.routes[0].legs.reduce((totals, leg) => {
      totals[0] += leg.distance.value;
      totals[1] += leg.duration.value;
      return totals;
    }, [0,0]);
    let distanceDiv = this.routeDiv.querySelector('.distance');
    let durationDiv = this.routeDiv.querySelector('.duration');
    distanceDiv.innerHTML = `${roundNumber(distance/1609.34, 2)} ${duration === 1 ? 'mile' : 'miles'}`;
    durationDiv.innerHTML = `${formatTime(duration)}`;
    this.routeDiv.querySelector('.route_info').classList.add('route_info_active');
  } else {
    handleAlert(this.alertDiv, "No route found");
  }
}

//drag and drop
Route.prototype.onDragOver = function(e) {
  e.preventDefault();
}

Route.prototype.onDrop = function(e, context) {
  e.preventDefault();
  let [locId, addLocation] = e.dataTransfer.getData('text').split(",");
  if (addLocation === "true") {
    context.addLocationToRoute(locId);
  }
}

Route.prototype.resetPolyline = function() {
  if (this.polyline) {
    this.polyline.setOptions({ strokeWeight: 0 });
  }
}

Route.prototype.addLocationToRoute = function(locId) {
  this.resetPolyline();

  let routeInfo = this.routeDiv.querySelector('.route_info');
  if (routeInfo) {
    routeInfo.classList.remove('route_info_active');
  }

  let isDuplicate = this.info[locId];
  if (isDuplicate !== undefined || this.size >= 23) {
    let text = isDuplicate !== undefined ? 'Duplicate entry' : 'Exceeded number of places';
    handleAlert(this.alertDiv, text);
    return;
  }

  let index = locations.info[locId];
  let location = locations.locations[index].location;
  let locationData = this.addLocation(this.routeDiv, location);
  let locationEntryDiv = locationData.element;
  locationEntryDiv.ondragstart = (e, addLocation) => {this.onDragStart(e, false) };
  locationEntryDiv.ondrop = (e, id, context) => { this.swapLocation(e, locId, this) };
  let removeButton = locationEntryDiv.querySelector('.remove');
  removeButton.classList.add('remove_active');
  this.size += 1;
}

Route.prototype.swapLocation = function(e, dropLocId, context) {
  context.resetPolyline();
  
  let routeInfo = context.routeDiv.querySelector('.route_info');
  if (routeInfo) {
    routeInfo.classList.remove('route_info_active');
  }
  let [dragLocId, addLocation] = e.dataTransfer.getData('text').split(",");
  let dragIndex = context.info[dragLocId];
  let dropIndex = context.info[dropLocId];
  if (dragIndex === dropIndex) {
    return;
  }
  let newRouteDiv = context.newRouteDiv();
  let tempLocation = context.locations.splice(dragIndex, 1)[0];
  context.locations.splice(dropIndex, 0, tempLocation);
  context.locations.forEach((location, i) => {
    let locationId = location.element.getAttribute('locid');
    context.info[locationId] = i;
    context.routeDiv.removeChild(location.element);
    context.routeDiv.appendChild(location.element);
  });
}


//click handlers
Route.prototype.handleClick = function(e, context) {
  if (e.target.classList.contains('remove')) {
    context.removeRouteDiv();
  }

  if (e.target.classList.contains('close')) {
    context.removeRouteLocationEntry(e);
  }

  if (e.target.classList.contains('check_box')) {
    context.handleCheckbox(e);
  }

  if (e.target.classList.contains('color')) {
    context.handleColorClick(e);
  }

  e.stopPropagation();
}

Route.prototype.removeRouteLocationEntry = function(e) {
  this.resetPolyline();
  
  let routeInfo = this.routeDiv.querySelector('.route_info');
  if (routeInfo) {
    routeInfo.classList.remove('route_info_active');
  }

  let locationEntryDiv = e.target.parentElement.parentElement;
  let locId = locationEntryDiv.getAttribute('locid');
  let index = this.info[locId];
  this.locations[index].marker.setMap(null);
  this.routeDiv.removeChild(locationEntryDiv);
  this.locations.splice(index, 1);
  this.info = {};
  this.locations.forEach((location, i) => {
    this.info[location.location.id] = i;
  });
  this.size = this.size - 1;
}

Route.prototype.handleCheckbox = function(e) {
  if (e.target.checked) {
    if (this.polyline) {
      this.polyline.setOptions({strokeWeight: 2, strokeColor: this.color });
    }
    this.map.map.fitBounds(this.results.routes[0].bounds);
    this.map.map.panToBounds(this.results.routes[0].bounds);
  } else {
    this.resetPolyline();
  }
}

Route.prototype.handleColorClick = function(e) {
  let color = e.target.getAttribute('color');
  if (color !== this.color) {
    let oldColor = this.routeDiv.querySelector(`div[color="${this.color}"]`);
    oldColor.classList.add('color_inactive');
    e.target.classList.remove('color_inactive');
    this.color = color;
    this.polyline.setOptions({ strokeColor: this.color });
  }
}

Route.prototype.removeRouteDiv = function() {
  this.removeMarkers();
  this.resetPolyline();
  this.polyline = null;
  myRoutes.removeRoute(this.index);
  routesDiv.removeChild(this.routeDiv);
}

class Routes {
  constructor(props) {
    this.routes = [];
    this.size = 0;
    this.transportationMode = "DRIVING";
    this.alertDiv = document.querySelector('.alert_routes');
  }
}

Routes.prototype.addRoute = function() {
  if (this.size >= 3) {
    handleAlert(this.alertDiv, 'Number of routes exceeded');
    return;
  }
  let newRoute = new Route(this.size);
  newRoute.newRoute();
  this.routes.push(newRoute);
  this.size++;
}

Routes.prototype.removeRoute = function(index) {
  this.routes.slice(index, 1);
  this.size--;
}

Routes.prototype.calculateRoutes = function() {
  if (this.size < 1) {
    handleAlert(this.alertDiv, "No routes added");
    return;
  }
  this.routes.forEach(route => {
    if (route.size > 1) {
      route.resetPolyline();
      route.getDirections(this.transportationMode);
    } else {
      let alert = route.routeDiv.querySelector('.alert');
      handleAlert(alert, "Add more locations to the list");
    }
  });
}

Routes.prototype.updateTransportation = function(e) {
  let mode = e.target.getAttribute("mode");
  if (this.transportationMode !== mode) {
    let previousMode = sidebarRightDiv.querySelector(`i[mode=${this.transportationMode}]`);
    previousMode.classList.toggle('md-dark');
    this.transportationMode = mode;
    e.target.classList.toggle('md-dark');
    this.calculateRoutes();
  }
}



