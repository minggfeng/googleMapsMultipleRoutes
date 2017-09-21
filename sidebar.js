'use strict';

const sidebarHelpers = {
  expand: () => {
    loaderHelpers.stop();
    if (!locationsDiv.classList.contains("locations_active")) {
      locationsDiv.classList.add("locations_active");
    }
    if (!sidebarDiv.classList.contains("sidebar_full")) {
      sidebarDiv.classList.add("sidebar_full");
    }
    if (!mapDiv.classList.contains("map_sidebar_full")) {
      mapDiv.classList.add("map_sidebar_full");
    }
    if (!sidebarRightDiv.classList.contains("sidebar_right_active")) {
      sidebarRightDiv.classList.add("sidebar_right_active");
    }
    if (!sidebarLeftDiv.classList.contains("sidebar_left_active")) {
      sidebarLeftDiv.classList.add("sidebar_left_active");
    }
    if (!menuButton.classList.contains("menu_hide")) {
      menuButton.classList.add("menu_hide");
    }
    map.resizeMap();
  },
  
  collapse: () => {
    locations.clearLocations();  
    clearChildNodes(locationsDiv);
    if (closeButton.classList.contains("close_active")) {
      closeButton.classList.remove("close_active");
    }
    if (locationsDiv.classList.contains("locations_active")) {
      locationsDiv.classList.remove("locations_active");
    }
    if (sidebarDiv.classList.contains("sidebar_full")) {
      sidebarDiv.classList.remove("sidebar_full");
    }
    if (mapDiv.classList.contains("map_sidebar_full")) {
      mapDiv.classList.remove("map_sidebar_full");
    }
    if (sidebarRightDiv.classList.contains("sidebar_right_active")) {
      sidebarRightDiv.classList.remove("sidebar_right_active");
    }
    if (sidebarLeftDiv.classList.contains("sidebar_left_active")) {
      sidebarLeftDiv.classList.remove("sidebar_left_active");
    }
    if (menuButton.classList.contains("menu_hide")) {
      menuButton.classList.remove("menu_hide");
    }
    map.resizeMap();
    searchForm.reset();
  }
}

