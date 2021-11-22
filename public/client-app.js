"use strict";

//  DOM selections

// control buttons -SHOW ALL -HIDE ALL -RESET BTN
const hideAll = document.getElementById("hideAll");
const showAll = document.getElementById("showAll");
const resetBtn = document.querySelector(".resetBtn");

//  raido buttons
const radioBtnSearch = document.getElementsByName("markerRadioSearch");

const academicBtn = document.getElementById("academic");
const nonAcademicBtn = document.getElementById("nonacademic");
const poiBtn = document.getElementById("poi");

//search buttons
const searchByCat = document.getElementById("category");
const searchByDept = document.getElementsByClassName("searchByDept");
const searchBoxField = document.querySelector(".searchBox");
const searchBoxBtn = document.querySelector(".searchByName");

//  drop down menu
const categorySelection = document.querySelector(".dropdownListCategory");
const deptSelection = document.querySelector(".dropdownListDepartment");

// search box
const searchBox = document.querySelector(".searchBox");

// raise box
const issueRequestStatus = document.querySelector(".sidebar--3 h5");
issueRequestStatus.style.visibility = "hidden";
const raiseIssueField = document.querySelector(".issueBox");
const raiseIssueBtn = document.querySelector(".raiseIssueBtn");

//info box
const infoBox = document.querySelector(".infoBox");
const heading = document.querySelector(".infoBox .markerName");
const category = document.querySelector(".infoBox .markerCategory");
const showMore = document.querySelector(".infoBoxBtn");

//Full InfoBox
const fullInfoBox = document.querySelector(".fullInfo");
const locName = document.querySelector(".locName");
const locCat = document.querySelector(".locCategory");
const locDept = document.querySelector(".locDept");
const locRestric = document.querySelector(".locRestrict");
const locDesc = document.querySelector(".fullInfoDesc p");
const image = document.querySelector(".locImg img");

//Close buttons
const btnCloseInfo = document.querySelector(".close-info");
const btnCloseFullInfo = document.querySelector(".close-fullInfo");

// Admin control button
const adminControl = document.querySelector(".adminBtn");

// close btn event listeners
btnCloseInfo.addEventListener("click", function () {
  infoBox.classList.add("hidden");
});

btnCloseFullInfo.addEventListener("click", function () {
  fullInfoBox.classList.add("hidden");
});

//Intialising api key
mapboxgl.accessToken =
  "pk.eyJ1IjoibWF5YW5rLWo2MTkiLCJhIjoiY2t0bjY3cWs0MDJiNzJwdGluZ29veW83OCJ9.ILceh4WZaH1WomhH_ZBAUw";

// Important site data
//  Marker element data GLOBAL
let markerDOM = [];
let i = 0;

// Map render function
const mapViewData = {
  container: "mapContainer",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [80.025084, 23.176894],
  zoom: 15.9,
  pitch: 36,
  hash: true,
};
const renderMap = () => {
  const map = new mapboxgl.Map(mapViewData);
  return map;
};

// Marker render function
const renderMarkers = (markerProperty, data) => {
  const marker = new ClickableMarker(markerProperty)
    .setLngLat({ lng: data.longitude, lat: data.latitude })
    .addTo(map);

  //Storing DOM data of marker into an array
  markerDOM[i] = marker.getElement();
  i++;
  // Event Listener
  marker.getElement().addEventListener("click", function () {
    if (infoBox.classList.contains("hidden")) {
      infoBox.classList.remove("hidden");
    }
    heading.textContent = data.loc_name;
    category.textContent = data.under_cat;
    showMore.value = data.marker_no;
    //  Centres the whole map on the current marker clicked
    //  map.jumpTo({ center: [data.coordinates[0], data.coordinates[1]] });
  });
};

const flyToMarker = (data) => {
  map.flyTo({
    center: [data.longitude, data.latitude],
    zoom: 17,
    speed: 0.6,
    curve: 1,
    easing(t) {
      return t;
    },
  });
};

// Render the full Info box
const renderFullInfoBox = (data) => {
  fullInfoBox.classList.remove("hidden");
  locName.textContent = data.loc_name;
  locCat.textContent = data.under_cat;
  locDept.textContent = data.dept_name;
  locRestric.textContent = data.restictions;
  locDesc.textContent = data.description;
  image.src = `localStorage/${data.marker_no}.jpg`;
};

//Rendering the map
const map = renderMap();

//Adding controls to the map
//Rotation and zoom features
map.addControl(new mapboxgl.NavigationControl());

//Clicable marker override
// extend mapboxGL Marker so we can pass in an onClick handler
class ClickableMarker extends mapboxgl.Marker {
  // new method onClick, sets _handleClick to a function you pass in
  onClick(handleClick) {
    this._handleClick = handleClick;
    return this;
  }
  _onMapClick(e) {
    const targetElement = e.originalEvent.target;
    const element = this._element;

    if (
      this._handleClick &&
      (targetElement === element || element.contains(targetElement))
    ) {
      this._handleClick();
    }
  }
}

// Utility functions
const removeMarker = async () => {
  markerDOM.forEach((marker) => {
    marker.remove();
  });
  i = 0;
  markerDOM.splice(0, markerDOM.length);
};

// uncheck radioBtns
const uncheckBtnGroup = (btnGrp) => {
  for (let i = 0; i < btnGrp.length; i++) {
    if (btnGrp[i].checked === true) {
      btnGrp[i].checked = false;
    }
  }
};

// Async Fetch request functions
const showAllMarkers = async () => {
  try {
    const response = await fetch("/api/v1/markers");
    let markerData = await response.json();

    markerData.forEach((marker) => {
      renderMarkers({ color: `${marker.C_property}` }, marker);
    });
    if (markerDOM.length === 1) {
      flyToMarker(markerData[0]);
    }
  } catch (error) {
    console.log(error);
  }
};

const showMarker = async (id) => {
  try {
    const response = await fetch(`/api/v1/markers/${id}`);
    let singleMarkerData = await response.json();

    renderFullInfoBox(singleMarkerData[0]);
  } catch (error) {
    console.log(error);
  }
};

const showByCategory = async (category) => {
  try {
    const response = await fetch(`/api/v1/markers/category/${category}`);
    let markerData = await response.json();
    markerData.forEach((marker) => {
      renderMarkers({ color: `${marker.C_property}` }, marker);
    });
    if (markerDOM.length === 1) {
      flyToMarker(markerData[0]);
    }
  } catch (error) {
    console.log(error);
  }
};

const showByName = async (name) => {
  try {
    const response = await fetch(`/api/v1/markers/name/${name}`);
    let markerData = await response.json();
    markerData.forEach((marker) => {
      renderMarkers({ color: `${marker.C_property}` }, marker);
    });
    if (markerDOM.length === 1) {
      flyToMarker(markerData[0]);
    }
  } catch (error) {
    console.log(error);
  }
};

const showByDepartment = async (department) => {
  try {
    const response = await fetch(`/api/v1/markers/department/${department}`);
    let markerData = await response.json();
    markerData.forEach((marker) => {
      renderMarkers({ color: `${marker.C_property}` }, marker);
    });
    if (markerDOM.length === 1) {
      flyToMarker(markerData[0]);
    }
  } catch (error) {
    console.log(error);
  }
};

const checkUser = async () => {
  try {
    const response = await fetch("/admin/userstatus");
    let status = await response.json();
    if (status.loggedIn === true) {
      window.open(`/dashboard.html?user=${status.userId}","_self`);
      return;
    }
    window.alert(`You are not logged in`);
  } catch (error) {
    console.log(error);
  }
};

const raiseIssue = async () => {
  let data = {
    issue: raiseIssueField.value,
  };
  data = JSON.stringify(data);
  fetch("/api/v1/markers/raise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      issueRequestStatus.style.visibility = "visible";
      if (data === true) {
        issueRequestStatus.textContent = "Issue submitted successfully!!!";
      } else {
        issueRequestStatus.textContent = "Unexpected error occured";
      }
    });
};

// On page load
showAllMarkers();

// single marker information request
showMore.onclick = function () {
  let id = showMore.value;
  infoBox.classList.add("hidden");
  showMarker(id);
};

//Specific search filter controls
// search by category
categorySelection.onchange = function () {
  let category =
    categorySelection.options[categorySelection.selectedIndex].value;
  if (markerDOM.length) {
    removeMarker();
  }
  showByCategory(category);
};

// search by department
deptSelection.onchange = function () {
  let department = deptSelection.options[deptSelection.selectedIndex].value;
  if (markerDOM.length) {
    removeMarker();
  }
  showByDepartment(department);
};

//  search by Name using searchBox
searchBoxBtn.addEventListener("click", () => {
  let searchKey = searchBox.value;
  if (markerDOM.length) {
    removeMarker();
  }
  showByName(searchKey);
});

// raise issue btn function
raiseIssueBtn.addEventListener("click", function () {
  raiseIssue();
});

// control Btns functionality [Hide all, Show all, reset btn]
// Show all markers
showAll.onclick = function () {
  if (markerDOM.length) {
    removeMarker();
  }
  showAllMarkers();
};

//hide all markers
hideAll.onclick = function () {
  if (markerDOM.length) {
    removeMarker();
  }
  uncheckBtnGroup(radioBtnSearch);
};

// reset Btn
resetBtn.addEventListener("click", function () {
  if (markerDOM.length) {
    removeMarker();
  }
  uncheckBtnGroup(radioBtnSearch);
  showAllMarkers();
});

// admin btn
adminControl.addEventListener("click", function () {
  checkUser();
});

// Radio buttons Sidebar--1 {Catgeory wise data search}
radioBtnSearch.forEach((radio) => {
  radio.onchange = function () {
    let category = radio.value;
    if (markerDOM.length) {
      removeMarker();
    }
    showByCategory(category);
  };
});
