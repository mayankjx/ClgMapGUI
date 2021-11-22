const express = require("express");
const markers = require("./routes/marker");
const authRoutes = require("./routes/loginRoute");
const admin = require("./routes/adminRoutes");
const authorization = require("./middleware/auth");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const mysqlConnection = require("./db/connect");

require("dotenv").config();

//  Instantiating the server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8080;
const host = 'localhost' || '0.0.0.0';

//  Setting middlewares
app.use(express.static("./public"));
app.use(cookieParser("MySecret"));

//  Routes
app.use("/api/v1/markers", markers);
app.use("/", authRoutes);
app.use("/admin", authorization, admin);

// listening to port and connecting database
const start = async () => {
  try {
    mysqlConnection.connect((err) => {
      if (!err) {
        console.log(`Database connected`);
      } else {
        console.log(err);
      }
    });
    app.listen(port, host, () => {
      console.log(`Server is listening to port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

// starting the server
start();
