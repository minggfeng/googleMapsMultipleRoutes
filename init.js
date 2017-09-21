function init() {
  loaderHelpers.start();
  navigator.geolocation.getCurrentPosition(data => {
    let latlng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
    map = new Map(searchText, latlng);
    searchService = createSearchService(map);
    locations = new Locations(map);
    myRoutes = new Routes(map);
    initListeners();
    loaderHelpers.stop();
  }, err => {
    // console.error(err);
    map = new Map(searchText);
    searchService = createSearchService(map);
    locations = new Locations(map);
    myRoutes = new Routes(map);
    initListeners();
    loaderHelpers.stop();
  });
}