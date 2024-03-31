const express = require("express");
const router = express.Router();

const medicalControllers = require("../controller/medicalControllers");
const loginsignupControllers = require("../controller/loginsignupControllers");
// get all issues
router.route("/issues").get(medicalControllers.getIssues);

// get all symptoms
router.route("/symptoms").get(medicalControllers.getSymptoms);

// get diagnosis by symptom id, gender and age
router.route("/diagnosis/symptoms/:symptomID/genders/:gender/ages/:age")
    .get(medicalControllers.getDiagnosisByIdAgeGender);

// get diagnosis by symptom name, gender and age
router.route("/diagnosis/:symptomName/genders/:gender/ages/:age")
    .get(medicalControllers.getDiagnosisBySymptomAgeGender);

// user signup
router.route("/signup").post(loginsignupControllers.userRegister);

// user login
router.route("/login").post(loginsignupControllers.userLogin);

// get information of current user
router.route("/current").get(loginsignupControllers.userCurrent);



module.exports = router;