'use strict';

function initListeners() {
  searchForm.addEventListener('submit', handleSearch);
  map.autocomplete.addListener('place_changed', handlePlaceChange);
  collapseButton.addEventListener('click', sidebarHelpers.collapse);
  menuButton.addEventListener('click', sidebarHelpers.expand);
  closeButton.addEventListener('click', removeResultsButtonHandleClick);
  sidebarRightDiv.addEventListener('click', (e) => { rightSidebarDivHandleClick(e, myRoutes) });
  window.addEventListener('resize', (e) => { map.resizeMap.bind(map) });
}