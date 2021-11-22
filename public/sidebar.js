"use strict";

//Selecting Elements

const searchBtn = document.querySelector(".searchBtn");
const navBtn = document.querySelector(".navBtn");
const raiseBtn = document.querySelector(".raiseBtn");
const btnCloseSearch = document.querySelector(".close-search");
const btnCloseNav = document.querySelector(".close-nav");
const btnCloseRaise = document.querySelector(".close-raise");

const searchBar = document.querySelector(".sidebar--1");
const navBar = document.querySelector(".sidebar--2");
const raiseBar = document.querySelector(".sidebar--3");

const tooltip = document.querySelector(".tooltip");

//infoBox element selection

//MAIN FUNCTIONS
searchBtn.addEventListener("click", function () {
  showOverlay(searchBar);
  hideOverlay(tooltip);
  hideOverlay(navBar);
  hideOverlay(raiseBar);
});

navBtn.addEventListener("click", function () {
  showOverlay(navBar);
  hideOverlay(tooltip);
  hideOverlay(raiseBar);
  hideOverlay(searchBar);
});

raiseBtn.addEventListener("click", function () {
  showOverlay(raiseBar);
  hideOverlay(tooltip);
  hideOverlay(navBar);
  hideOverlay(searchBar);
});

//UTILITY functions

const showOverlay = function (container) {
  container.classList.remove("hidden");
};

const hideOverlay = function (container) {
  container.classList.add("hidden");
};

//  Close buttons

btnCloseSearch.addEventListener("click", function () {
  showOverlay(tooltip);
  hideOverlay(searchBar);
});

btnCloseNav.addEventListener("click", function () {
  showOverlay(tooltip);
  hideOverlay(navBar);
});

btnCloseRaise.addEventListener("click", function () {
  showOverlay(tooltip);
  hideOverlay(raiseBar);
});
