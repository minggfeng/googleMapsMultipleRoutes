'use strict';

function handleAlert(element, message) {
  element.innerHTML = message;
  element.classList.add('alert_active');
  element.addEventListener('animationend', (e) => {
    element.classList.remove('alert_active');
  }, false);
}

function formatTime(time) {
  if (time < 60) {
    return "Less than 1 min";
  }
  let secondsRemaining = time;
  let result = '';
  let days = Math.floor(secondsRemaining/(3600 * 24));
  if (days > 0) {
    result += `${days} ${days === 1 ? 'day ' : 'days '}`;
  }
  secondsRemaining = secondsRemaining - (days * (3600 * 24));

  let hours = Math.floor(secondsRemaining/3600);
  if (hours > 0) {
    result += `${hours} ${hours === 1 ? 'hr ' : 'hrs '}`;
  }
  secondsRemaining = secondsRemaining - (hours * 3600);
  let mins = Math.floor(secondsRemaining/60);
  if (mins > 0) {
    result += `${mins} ${mins === 1 ? 'min ' : 'mins '}`;
  }
  return result;
}

function roundNumber(number, precision) {
  let factor = Math.pow(10, precision);
  let tempNumber = number * factor;
  let roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
}

function clearChildNodes(parentElement) {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
}

function rightSidebarDivHandleClick(e, context) {
  if (e.target.classList.contains('add_route')) {
    context.addRoute();
  }

  if (e.target.classList.contains('calc_routes')) {
    context.calculateRoutes();
  }
  if (e.target.classList.contains('transportation')) {
    context.updateTransportation(e);
  }

  e.stopPropagation();
}

function removeResultsButtonHandleClick(e) {
  searchForm.reset();
  locations.clearLocations();  
  clearChildNodes(locationsDiv);
  if (closeButton.classList.contains('close_active')) {
    closeButton.classList.remove('close_active');
  }
  e.stopPropagation();
}

function handleSearch(e) {
  e.preventDefault();
  let query = searchText.value;
  if (query === "") {
    handleAlert(alertSearchDiv, 'Search criteria required');
  } else {
    loaderHelpers.start();
    searchService.initService(query);
  }
};

function handlePlaceChange(e) {
  let newLocation = map.autocomplete.getPlace();
  if (newLocation.id) {
    locations.clearLocations();
    clearChildNodes(locationsDiv);
    map.resetBounds();
    sidebarHelpers.expand();
    locations.addLocation(locationsDiv, newLocation);
    if (!closeButton.classList.contains('close_active')) {
      closeButton.classList.add('close_active');
    }
  }
};

