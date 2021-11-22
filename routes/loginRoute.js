const express = require("express");
const router = express.Router();

const controller = require("../controller/loginController");

router.route("/login").post(controller.checkCredentials);

module.exports = router;
