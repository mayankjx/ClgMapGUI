const express = require("express");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const mysqlConnection = require("../db/connect");

const checkCredentials = async (req, res, next) => {
  try {
    console.log(`User hit this request`);
    console.log(req.body);
    let username = req.body.username;
    let password = req.body.password;
    let sql = `SELECT * FROM login_credentials WHERE user_name = '${username}'`;
    mysqlConnection.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        res.send();
      }
      if (result.length == 0) {
        console.log(`No data found incorrect credentials`);
        res.send(`INCORRECT CREDENTIALS`);
      }
      if (result.length > 0) {
        console.log(result[0].user_name, result[0].password, result[0].user_id);
        console.log(typeof result[0].user_id);
        let id = result[0].user_id;
        if (result[0].password === password) {
          console.log(`Login successfull creating cookies`);
          let isLoggedIn = true;
          let userProperties = {
            maxAge: 1000 * 60 * 60 * 4, // 4 hours cookie time
            httpOnly: true,
            signed: true,
          };
          res.cookie("user", [username, id, isLoggedIn], userProperties);
          console.log(`Cookie created`);
          res.redirect(`dashboard.html?user=${id}`);
          next();
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { checkCredentials };
