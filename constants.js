'use strict'

const mapDiv = document.querySelector('.map');
const searchForm = document.querySelector('.search');
const searchText = document.querySelector('.search_text');
const locationsDiv = document.querySelector('.locations');
const routesDiv = document.querySelector('.routes');
const loaderDiv = document.querySelector('.loader');
const sidebarDiv = document.querySelector('.sidebar');
const closeButton = document.querySelector('.close');
const sidebarRightDiv = document.querySelector('.sidebar_right');
const sidebarLeftDiv = document.querySelector('.sidebar_left');
const alertSearchDiv = document.querySelector('.alert_search');
const collapseButton = document.querySelector('.collapse');
const menuButton = document.querySelector('.menu');

let locations;
let myRoutes;
let searchService;
let map;
