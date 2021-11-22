"use strict";

const userContainer = document.querySelector(".userControl");
const adminContainer = document.querySelector(".adminControl");

userContainer.onclick = function () {
  window.open("/map.html", "_self");
};

adminContainer.onclick = function () {
  window.open("/login.html", "_self");
};
