"use strict";

// DOM selection
const markerName = document.querySelector(".markerName");
const markerLat = document.querySelector(".markerLatitute");
const markerLang = document.querySelector(".markerLongitude");
const markerCat = document.querySelector(".markerCategory");
const markerDept = document.querySelector(".markerDepartment");
const markerDesc = document.querySelector(".descriptionArea");
const markerRest = document.querySelector(".restriction");

const alternateBtn = document.querySelector(".alternate");

const editStatus = document.querySelector(".edit-status");
editStatus.style.visibility = "hidden";

// getting params
const params = window.location.search;
let markerId = new URLSearchParams(params).get("id");
markerId = parseInt(markerId);

// Calling data from server
const getMarkerData = async (id) => {
  try {
    const response = await fetch(`/api/v1/markers/${id}`);
    let data = await response.json();

    markerDesc.innerHTML = data[0].description;
    markerRest.defaultValue = data[0].restrictions;
    markerName.defaultValue = data[0].loc_name;
    markerCat.defaultValue = data[0].under_cat;
    markerDept.defaultValue = data[0].dept_name;
  } catch (error) {
    console.log(error);
  }
};

const sendData = async () => {
  let data = {
    markerName: markerName.value,
    markerCategory: markerCat.value,
    markerDepartment: markerDept.value,
    description: markerDesc.value,
    restriction: markerRest.value,
    id: markerId,
  };
  data = JSON.stringify(data);
  fetch("/admin/marker/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  })
    .then(function () {
      editStatus.textContent = "Edit Marker successfull!!";
      editStatus.style.visibility = "visible";
    })
    .catch((err) => {
      console.log(err);
    });
};

// button to send data to server
alternateBtn.addEventListener("click", function () {
  sendData();
});
// On page load
getMarkerData(markerId);
