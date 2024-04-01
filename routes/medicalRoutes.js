const express = require("express");
const router = express.Router();

const medicalControllers = require("../controller/medicalControllers");
const loginsignupControllers = require("../controller/loginsignupControllers");
// get all issues
router.route("/issues").get(medicalControllers.getIssues);

// get issue by id
router.route("/issues/:issueID").get(medicalControllers.getIssueByID);

// get all symptoms
router.route("/symptoms").get(medicalControllers.getSymptoms);

// record patient fundamental infomation
router.route("/diagnosis2").post(medicalControllers.postPatientInfo);

// record patient symptoms infomation
router.route("/diagnosis3").post(medicalControllers.postPatientSymptom);

// get diagnosis information
router.route("/diagnosis4").get(medicalControllers.getDiagnosis);


// user signup
router.route("/signup").post(loginsignupControllers.userRegister);

// user login
router.route("/login").post(loginsignupControllers.userLogin);

// get information of current user
router.route("/current").get(loginsignupControllers.userCurrent);



module.exports = router;