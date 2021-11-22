const express = require("express");
const mysqlConnection = require("../db/connect");

const userData = async (req, res) => {
  try {
    if (req.isAuthenticated === true) {
      const id = req.params.userId;
      console.log(id);
      mysqlConnection.query(
        `SELECT *FROM admin WHERE ID_no = ${id}`,
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
    } else {
      console.log(`Unauthorized request made`);
      res.send(`Unauthorized`);
    }
  } catch (error) {
    console.log(error);
  }
};

const userStatus = async (req, res) => {
  if (req.isAuthenticated === false) {
    res.send(false);
    return;
  }
  let status = {
    loggedIn: true,
    userId: req.signedCookies.user[1],
  };
  res.send(status);
};

const allMarkerCount = async (req, res) => {
  if (req.isAuthenticated === true) {
    mysqlConnection.query(
      `
    SELECT COUNT(*) AS count
    FROM locations;`,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        res.send(result);
      }
    );
  } else {
    console.log(`Unauthorized request made`);
    res.send(`Unauthorized`);
  }
};

const markerCount = async (req, res) => {
  if (req.isAuthenticated === true) {
    mysqlConnection.query(
      `SELECT COUNT(*) AS count,under_cat
    FROM locations
    GROUP BY under_cat;`,
      (err, result) => {
        if (err) {
          console.log(err);
        }
        res.send(result);
      }
    );
  } else {
    console.log(`Unauthorized request made`);
    res.send(`Unauthorized`);
  }
};

const issueCount = async (req, res) => {
  if (req.isAuthenticated) {
    try {
      mysqlConnection.query(
        `SELECT COUNT(*) AS count
      FROM issues;`,
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
        }
      );
    } catch (error) {}
  } else {
    console.log(`Unauthorized request made`);
    res.send(`Unauthorized`);
  }
};

const insertMarker = async (req, res) => {
  console.log(`Insert request hit`);
  if (req.isAuthenticated === true) {
    try {
      const {
        markerName: name,
        markerCategory: cat,
        markerLat: lat,
        markerLang: lang,
        markerDepartment: dept,
        description: desc,
        restriction: rest,
        id: markerId,
      } = req.body;
      console.log(req.body);

      mysqlConnection.query(
        `INSERT INTO markers (marker_id,latitude,longitude) VALUES(${markerId},${lat},${lang});`,
        (err, result) => {
          if (err) {
            console.log(err);
          }
        }
      );
      console.log(`Marker table updated`);

      res.redirect(307, `/admin/marker/insert/${markerId}`);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log(`Unauthorized request made`);
    res.send(`Unauthorized`);
  }
};

const insertMarkerWithId = async (req, res) => {
  if (req.isAuthenticated === true) {
    const {
      markerName: name,
      markerCategory: cat,
      markerLat: lat,
      markerLang: lang,
      markerDepartment: dept,
      description: desc,
      restriction: rest,
    } = req.body;
    const markerId = req.params.markerId;
    console.log(markerId);
    console.log(req.body);
    try {
      mysqlConnection.query(
        `INSERT INTO locations (marker_no,loc_name,under_cat,under_dept,description,restrictions) VALUES(${markerId},'${name}','${cat}','${dept}','${desc}','${rest}');`,
        (err, result) => {
          if (err) {
            console.log(err);
          }
        }
      );
      console.log(`Location table updated insert successfull`);
      res.send();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log(`Unauthorized request made`);
    res.send(`Unauthorized`);
  }
};

const editMarker = async (req, res) => {
  console.log(`Update Request hit`);
  if (req.isAuthenticated === true) {
    const {
      markerName: name,
      markerCategory: cat,
      markerDepartment: dept,
      description: desc,
      restriction: rest,
      id: markerId,
    } = req.body;
    console.log(name, cat, dept, desc, rest, markerId);
    mysqlConnection.query(
      `UPDATE locations
    SET loc_name= '${name}',
        under_cat= '${cat}',
        under_dept= '${dept}',
        description= '${desc}',
        restrictions= '${rest}'
    WHERE marker_no= ${markerId};`,
      (err, rows, fields) => {
        if (err) {
          console.log(err);
        }
      }
    );
    console.log(`Update successful`);
    res.send();
  } else {
    console.log(`Unauthorized request made`);
    res.send(`Unauthorized`);
  }
};

const deleteMarker = async (req, res) => {
  if (req.isAuthenticated === true) {
    const id = req.params.markerId;
    try {
      mysqlConnection.query(
        `DELETE FROM markers
      WHERE marker_id=${id};`,
        (err, result) => {
          if (err) {
            console.log(err);
          }
        }
      );
      console.log(`Marker Deleted`);
      res.send();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log(`Unauthorized request made`);
    res.send();
  }
};

const deleteCookie = async (req, res) => {
  if (req.isAuthenticated === true) {
    res.clearCookie("user");
    console.log(`User logged out`);
    res.send(true);
  } else {
    res.send(`Unauthorized`);
  }
};

const maxOfMarker = async (req, res) => {
  mysqlConnection.query(
    `SELECT MAX(marker_id) AS max
  FROM markers;`,
    (err, result) => {
      if (!err) {
        res.send(result);
      } else {
        console.log(error);
      }
    }
  );
};

const getIssue = async (req, res) => {
  if (req.isAuthenticated === true) {
    console.log(`Get issue request hit`);
    mysqlConnection.query(
      `SELECT issue_id,issue_description
    FROM issues;`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  } else {
    console.log(`Unauthorized request made`);
    res.send(`Unauthorized`);
  }
};

const deleteIssue = async (req, res) => {
  if (req.isAuthenticated === true) {
    console.log(`delete request made`);
    const id = req.params.id;
    mysqlConnection.query(
      `DELETE FROM issues
    WHERE issue_id= ${id};`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send();
        }
      }
    );
  } else {
    console.log(`Unauthorized request made`);
    res.send(`Unauthorized`);
  }
};

module.exports = {
  userData,
  allMarkerCount,
  markerCount,
  issueCount,
  insertMarker,
  insertMarkerWithId,
  editMarker,
  deleteMarker,
  deleteCookie,
  userStatus,
  maxOfMarker,
  getIssue,
  deleteIssue,
};
