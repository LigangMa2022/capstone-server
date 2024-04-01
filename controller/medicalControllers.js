const knex = require("knex")(require("../knexfile"));
const natural = require('natural');//using 'narural' library for similarity analysis


const getIssues = async (req, res) => {
    try {
      const data = await knex("issues");
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({
        message: `Error retrieving issues: ${err}`,
      });
    }
  };
const getIssueByID = async (req, res) => {
  try {
    const data = await knex('issuedetails').where("ID",req.params.issueID);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: `Error retrieving issues: ${err}`,
    });
  }
}

const getSymptoms = async (req, res) => {
    try {
      const data = await knex("symptoms");
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({
        message: `Error retrieving symptoms: ${err}`,
      });
    }
  };

// these two variables will be used for two submits from the front-end,
// then combine them and insert into one record of patient table in DB
let newPatientInfo = {};
let newPatientSymptoms = [];

const postPatientInfo = async (req,res)=> {
  const {AgeGroup, Height, Weight, Gender} = req.body;
  newPatientInfo = {
    AgeGroup,
    Height,
    Weight,
    Gender
  };

  try {
      // await knex('patientInfo').insert(newPatientInfo);
      res.status(201).send("Patient info saved successfully!");
  } catch (error) {
      console.log(error);
      res.status(400).send("Failed record patient info");
  }
}

const postPatientSymptom = async (req,res)=> {
  const selectedSymptoms = req.body.selectedSymptoms;
  const inputSymptoms = (req.body.inputSymptoms.split(',')).filter(Boolean).map(item => item.trim());
  newPatientSymptoms = selectedSymptoms.concat(inputSymptoms);
  const newPatientSymptom = newPatientSymptoms.join(',');

  const newPatientData = {
    ...newPatientInfo,
    newPatientSymptom
};

  try {
      await knex('patientInfo').insert(newPatientData);
      res.status(201).send("Patient basic Info and Symptoms recorded successfully!");
  } catch (error) {
      console.log(error);
      res.status(400).send("Failed record patient's Info or Symptoms");
  }
}

const getDiagnosis = async (req,res) => {

  await knex('symptoms')
  .select('ID', 'Name')
  .then((rows) => {

    // Compare each symptom in the array with all symptom names from the database
    for (const symptom of newPatientSymptoms) {
      let bestMatch = { symptom, similarity: Infinity, bestName: '', bestID: '' };

      for (const dbSymptom of rows) {
        const distance = natural.LevenshteinDistance(symptom, dbSymptom.Name);
        console.log(`Comparing ${symptom} with ${dbSymptom.Name}: distance=${distance}`);
        if (distance < bestMatch.similarity) {
          bestMatch = { symptom, similarity: distance, bestName: dbSymptom.Name, bestID: dbSymptom.ID };
        }
      }
      console.log('Best match:', bestMatch);

      // Use the best match symptom ID to query diagnosis info from another table
      knex('diagnosis')
      .select('*')
      .where('SymptomID', bestMatch.bestID)
      .then((diagnosisResults) => {
        console.log("diagnosisResults:", diagnosisResults);
        res.json(diagnosisResults);
      })
      .catch((err) => {
        console.error('Error querying diagnosis:', err);
      });
      console.log("bestMatch.bestID:",bestMatch.bestID);
    }
  })
  .catch((err) => {
    console.error('Error querying symptoms:', err);
  });

}

module.exports = {
    getIssues,
    getIssueByID,
    getSymptoms,
    postPatientInfo,
    postPatientSymptom,
    getDiagnosis
};