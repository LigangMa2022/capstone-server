const express = require("express");
const router = express.Router();
const medicalControllers = require("../controller/medicalControllers")

// get all issues
router.route("/issues").get(medicalControllers.getIssues);

// get all symptoms
router.route("/symptoms").get(medicalControllers.getSymptoms);

// get diagnosis by symptom id, gender and age
router.route("/diagnosis/symptoms/:symptomID/genders/:gender/ages/:age")
    .get(medicalControllers.getDiagnosisByIdAgeGender);

router.route("/diagnosis/:symptomName/genders/:gender/ages/:age")
    .get(medicalControllers.getDiagnosisBySymptomAgeGender);

module.exports = router;