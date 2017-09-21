'use strict';

function createSearchService(map) {
  let newSearchService = {};

  newSearchService.serviceCallback = (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        locations.clearLocations();
        clearChildNodes(locationsDiv);
        map.resetBounds();
        locations.addResults(results);
      } else {
        loaderHelpers.stop();
        handleAlert(alertSearchDiv, 'No matching results');
      }
    };

  newSearchService.initService = (query, radius, type) => {
      let options = {};
      options.location = map.map.getCenter();
      options.query = query;
      options.radius = radius || 5;
      if (type) {
        options.type = type;
      }
      map.service.textSearch(options, newSearchService.serviceCallback);
    };

  return newSearchService;
}


