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
const insertStatus = document.querySelector(".insert-status");
insertStatus.style.visibility = "hidden";

let markerId;

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

const maxOfMarker = async () => {
  const response = await fetch("/admin/marker/maxof");
  let max = await response.json();
  markerId = max[0].max + 1;
};

maxOfMarker();

const sendData = async () => {
  let data = {
    markerName: markerName.value,
    markerLat: markerLat.value,
    markerLang: markerLang.value,
    markerCategory: markerCat.value,
    markerDepartment: markerDept.value,
    description: markerDesc.value,
    restriction: markerRest.value,
    id: markerId,
  };
  data = JSON.stringify(data);
  fetch("/admin/marker/insert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  })
    .then(function () {
      insertStatus.textContent = `Insert Marker successfull!!`;
      insertStatus.style.visibility = "visible";
    })
    .catch((err) => {
      console.log(err);
    });
};

// button to send data to server
alternateBtn.addEventListener("click", function () {
  sendData();
});
