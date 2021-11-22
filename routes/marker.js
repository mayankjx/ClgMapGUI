const express = require("express");
const router = express.Router();

const controls = require("../controller/marker");

router.route("/").get(controls.getAllMarkers);
router.route("/:id").get(controls.getMarker);
router.route("/category/:category").get(controls.getMarkerbyCategory);
router.route("/name/:name").get(controls.getMarkerbyName);
router.route("/department/:department").get(controls.getMarkerByDepartment);
router.route("/raise").post(controls.raiseIssue);

module.exports = router;
