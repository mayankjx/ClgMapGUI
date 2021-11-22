const express = require("express");
const router = express.Router();

const admin = require("../controller/admin");

router.route("/userstatus").get(admin.userStatus);
router.route("/user/:userId").get(admin.userData);
router.route("/markers/count").get(admin.allMarkerCount);
router.route("/markers/count/category").get(admin.markerCount);
router.route("/issue/count").get(admin.issueCount);
router.route("/marker/insert").post(admin.insertMarker);
router.route("/marker/insert/:markerId").post(admin.insertMarkerWithId);
router.route("/marker/edit").post(admin.editMarker);
router.route("/marker/delete/:markerId").delete(admin.deleteMarker);
router.route("/logout").get(admin.deleteCookie);
router.route("/marker/maxof").get(admin.maxOfMarker);
router.route("/issue").get(admin.getIssue);
router.route("/issue/delete/:id").delete(admin.deleteIssue);

module.exports = router;
