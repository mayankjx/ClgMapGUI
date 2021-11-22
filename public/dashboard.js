"use strict";

// DOM Selections
const mainPage = document.querySelector(".main-admin-container");
mainPage.style.visibility = "hidden";
// Proflie card selections
const profileName = document.querySelector(".profile-name");
const profileDept = document.querySelector(".profile-department");
const profileBio = document.querySelector(".bio");

const mapRedirect = document.querySelector(".map-redirect-control");
const logout = document.querySelector(".logout-control");

// Main control
const allMarkerCount = document.querySelector(".update-count-markers h2");
const issueCount = document.querySelector(".update-count-issues h2");

const academicCount = document.querySelector(".marker-academic");
const nonacademicCount = document.querySelector(".marker-nonacademic");
const poiCount = document.querySelector(".marker-poi");
const horCount = document.querySelector(".marker-hor");
const oafCount = document.querySelector(".marker-oaf");

// Search controls
const adminSearch = document.querySelector(".admin-searchbox");

const filterbox = document.querySelector(".admin-control-filterbox");
filterbox.style.visibility = "hidden";
const filterBtn = document.querySelector(".admin-control-filter");
const closeFilterBtn = document.querySelector(".close-filter");

// marker container
let deleteBtnArray;

// Filter box content
//  drop down menu
const categorySelection = document.querySelector(".dropdownListCategory");
const deptSelection = document.querySelector(".dropdownListDepartment");

const viewAllBtn = document.querySelector(
  ".admin-control-markers-container h3"
);

// Marker display container
const markerContainer = document.querySelector(".admin-control-markers");

// Issue display container
const issueContainer = document.querySelector(".side-issue-container");

// Sidebar container
const insertBtn = document.querySelector(".sidebar-insertbtn");

// getting params
const params = window.location.search;
let userId = new URLSearchParams(params).get("user");
userId = parseInt(userId);

// RENDER DATA
// render profile card
const renderProflie = (data) => {
  profileName.textContent = data.First_name + " " + data.Last_name;
  profileDept.textContent = data.in_department;
  profileBio.textContent = data.details;
};

// render marker container with markers
const renderMarkerContainer = (markerArray) => {
  const allMarkers = markerArray
    .map((marker) => {
      return `<div class="single-marker">
      <h5>${marker.loc_name}</h5>
      <div class="marker-links">
        <a href="edit.html?id=${marker.marker_no}"><img src="design/edit-marker.png" /></a>
        <button type="button" class="marker-delete-btn" value = "${marker.marker_no}">
          <img src="design/delete.png" />
        </button>
      </div>
    </div>`;
    })
    .join("");
  markerContainer.innerHTML = allMarkers;
  let deleteBtn = document.querySelectorAll(".marker-delete-btn");
  deleteBtn.forEach((delBtn) => {
    delBtn.addEventListener("click", function () {
      let id = delBtn.value;
      let delMarkerChoice = confirm("You sure you wanna delete?");
      if (delMarkerChoice) {
        deleteMarker(id);
      }
    });
  });
};

const renderIssueContainer = async (issueArray) => {
  const allIssues = issueArray
    .map((issue) => {
      return `<div class="single-issue">
    <h5>${issue.issue_id}</h5>
    <p>${issue.issue_description}</p>
    <div class="issue-links">
      <button type="button" class="issue-delete-btn" value = "${issue.issue_id}">
        <img src="design/delete.png" />
      </button>
    </div>
  </div>`;
    })
    .join("");
  issueContainer.innerHTML = allIssues;
  let issueDeleteBtn = document.querySelectorAll(".issue-delete-btn");
  issueDeleteBtn.forEach((issueDelBtn) => {
    issueDelBtn.addEventListener("click", function () {
      let id = issueDelBtn.value;
      let delIssueChoice = confirm(`Are you sure you wanna delete Issue?`);
      if (delIssueChoice) {
        deleteIssue(id);
      }
    });
  });
};

// client-server requests

// user logout request
const logoutUser = async () => {
  try {
    const response = await fetch("/admin/logout");
    let status = await response.json();
    if (status === true) {
      console.log(`User logged out successfully`);
      window.open("/index.html", "_self");
      return;
    }
    console.log(`Unexpected error occured`);
  } catch (error) {
    console.log(error);
  }
};

// checking authentication
const checkUser = async () => {
  try {
    const response = await fetch("/admin/userstatus");
    let status = await response.json();
    if (status.loggedIn === true) {
      mainPage.style.visibility = "visible";
      return;
    }
    window.alert(`You are not logged in`);
  } catch (error) {
    console.log(error);
  }
};

// UserData request for profile card
const userData = async (userId) => {
  if (userId === null && userId === undefined) {
    console.log(`Unauthorized request`);
    return;
  }
  try {
    const response = await fetch(`/admin/user/${userId}`);
    let profile = await response.json();
    renderProflie(profile[0]);
  } catch (error) {
    console.log(error);
  }
};

// Render all marker request
const markerData = async () => {
  try {
    const response = await fetch("/api/v1/markers");
    let allMarkerData = await response.json();
    renderMarkerContainer(allMarkerData);
  } catch (error) {
    console.log(error);
  }
};

// Render all issue request
const issueData = async () => {
  try {
    const response = await fetch("/admin/issue");
    let allIssueData = await response.json();
    renderIssueContainer(allIssueData);
  } catch (error) {
    console.log(error);
  }
};

// Show by category request
const showByCategory = async (category) => {
  try {
    const response = await fetch(`/api/v1/markers/category/${category}`);
    let markerData = await response.json();
    renderMarkerContainer(markerData);
  } catch (error) {
    console.log(error);
  }
};

// Show by department request
const showByDepartment = async (department) => {
  try {
    const response = await fetch(`/api/v1/markers/department/${department}`);
    let markerData = await response.json();
    renderMarkerContainer(markerData);
  } catch (error) {
    console.log(error);
  }
};

// Search by name request
const showByName = async (name) => {
  try {
    const response = await fetch(`/api/v1/markers/name/${name}`);
    let markerData = await response.json();
    renderMarkerContainer(markerData);
  } catch (error) {
    console.log(error);
  }
};

// Delete marker request
const deleteMarker = async (markerId) => {
  try {
    const response = await fetch(`/admin/marker/delete/${markerId}`, {
      method: "DELETE",
    });
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

// Delete issue request
const deleteIssue = async (issueId) => {
  try {
    const response = await fetch(`/admin/issue/delete/${issueId}`, {
      method: "DELETE",
    });
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

// Count requests
// all marker count request
const countAllMarkers = async () => {
  const response = await fetch("/admin/markers/count");
  let data = await response.json();
  allMarkerCount.textContent = data[0].count;
};

// count by category request
const countByCategory = async () => {
  const response = await fetch("/admin/markers/count/category");
  let data = await response.json();
  academicCount.textContent = data[0].count;
  nonacademicCount.textContent = data[3].count;
  poiCount.textContent = data[5].count;
  horCount.textContent = data[2].count;
  oafCount.textContent = data[1].count + data[4].count;
};

// count issues request
const countAllIssues = async () => {
  const response = await fetch("/admin/issue/count");
  let data = await response.json();
  issueCount.textContent = data[0].count;
};

// BTNS
// Map redirect
mapRedirect.addEventListener("click", function () {
  window.open("/map.html", "_self");
});

// Logout function
logout.addEventListener("click", function () {
  logoutUser();
});

// View All button
viewAllBtn.addEventListener("click", function () {
  markerData();
});

// Insert Button
insertBtn.addEventListener("click", function () {
  window.open("/insert.html", "_self");
});

// Open filter box button
filterBtn.addEventListener("click", function () {
  filterbox.style.visibility = "visible";
});

// Close filter box button
closeFilterBtn.addEventListener("click", function () {
  filterbox.style.visibility = "hidden";
});

// searchbox
adminSearch.addEventListener("keyup", function (event) {
  if (event.keyCode == 13) {
    let searchKey = adminSearch.value;
    markerContainer.innerHTML = "";
    showByName(searchKey);
  }
});

// Delete marker button

// Filter Options
// category wise search
categorySelection.onchange = function () {
  let category =
    categorySelection.options[categorySelection.selectedIndex].value;
  markerContainer.innerHTML = "";
  showByCategory(category);
};

// department wise search
deptSelection.onchange = function () {
  let department = deptSelection.options[deptSelection.selectedIndex].value;
  markerContainer.innerHTML = "";
  showByDepartment(department);
};

//On Page Load
checkUser();
userData(userId);
markerData();
issueData();
countAllMarkers();
countByCategory();
countAllIssues();
