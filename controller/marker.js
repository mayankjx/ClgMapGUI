const express = require("express");
const mysql = require("mysql");
const mysqlConnection = require("../db/connect");

// Get all the markers data
const getAllMarkers = async (req, res, next) => {
  try {
    mysqlConnection.query(
      `SELECT loc_name,marker_no,under_cat,latitude,longitude,C_property
    FROM locations,markers,category
    WHERE marker_no=marker_id
    AND under_cat=C_name
    ORDER BY marker_no ASC;`,
      (err, rows, fields) => {
        if (!err) {
          res.status(201).send(rows);
        } else {
          res.status(404).send(err);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Get single marker data
const getMarker = async (req, res) => {
  try {
    const { id: markerId } = req.params;
    mysqlConnection.query(
      `SELECT loc_name,marker_no,under_cat,dept_name,description,restrictions
      FROM locations,department
      WHERE under_dept=dept_code
        AND marker_no= ${markerId}`,
      (err, rows, fields) => {
        if (!err) {
          console.log(`Data accessed successfully`);
          res.status(201).send(rows);
        } else {
          console.log(err);
          res.status(404).send();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// Get marker by category
const getMarkerbyCategory = async (req, res) => {
  try {
    const { category: markerCategory } = req.params;
    console.log(markerCategory);
    mysqlConnection.query(
      `SELECT loc_name,marker_no,under_cat,latitude,longitude,C_property
      FROM locations,markers,category
      WHERE marker_no=marker_id
      AND under_cat=C_name
      AND under_cat = '${markerCategory}'`,
      (err, rows, fields) => {
        if (!err) {
          console.log(`Data accessed successfully`);
          res.status(201).send(rows);
        } else {
          console.log(err);
          res.status(404).send(err);
        }
      }
    );
  } catch (error) {}
};

// Get marker by name
const getMarkerbyName = async (req, res) => {
  try {
    const key = req.params.name;
    console.log(key + " search request");
    mysqlConnection.query(
      `SELECT loc_name,marker_no,under_cat,latitude,longitude,under_dept,description,restrictions,C_property
      FROM locations,markers, category
      WHERE marker_no=marker_id AND under_cat=C_name
        AND  loc_name LIKE '%${key}%';`,
      (err, rows, fields) => {
        if (!err) {
          console.log(`Data accessed successfully`);
          res.status(201).send(rows);
        } else {
          console.log(err);
          res.status(404).send();
        }
      }
    );
  } catch (error) {}
};

const getMarkerByDepartment = async (req, res) => {
  try {
    const { department: department } = req.params;
    mysqlConnection.query(
      `SELECT loc_name,marker_no,under_cat,latitude,longitude,C_property
      FROM locations,markers,category
      WHERE marker_no=marker_id
      AND under_cat=C_name
      AND under_dept = '${department}'`,
      (err, rows, fields) => {
        if (!err) {
          console.log(`Data accessed successfully`);
          res.status(201).send(rows);
        } else {
          console.log(err);
          res.status(404).send();
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const raiseIssue = async (req, res) => {
  const issue = req.body.issue;
  try {
    mysqlConnection.query(
      `INSERT INTO issues (issue_description) VALUES('${issue}');`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(true);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllMarkers,
  getMarker,
  getMarkerbyCategory,
  getMarkerbyName,
  getMarkerByDepartment,
  raiseIssue,
};
