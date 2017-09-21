'use strict';

const loaderHelpers = {
  start: () => {
    if (loaderDiv.classList.contains("loader_pause")) {
      loaderDiv.classList.remove("loader_pause");
    }
    if (closeButton.classList.contains("close_active")) {
      closeButton.classList.remove("close_active");
    }
    loaderDiv.classList.add("loader_start");
  },
  
  stop: () => {
    if (loaderDiv.classList.contains("loader_start")) {
      loaderDiv.classList.remove("loader_start");
    }
    loaderDiv.classList.add("loader_pause");
  } 
}
