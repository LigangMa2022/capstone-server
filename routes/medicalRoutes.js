const express = require("express");
const router = express.Router();
const medicalControllers = require("../controller/medicalControllers")

// get all issues
router.route("/issues").get(medicalControllers.getIssues);

// get all symptoms
router.route("/symptoms").get(medicalControllers.getSymptoms);

router.route("/diagnosis").get(medicalControllers.getDiagnosis);

// router.get("/diagnosis",async (req,res)=>{
//     const diagnosisData = await knex("diagnosis");
//     res.json(diagnosisData);
// })

module.exports = router;