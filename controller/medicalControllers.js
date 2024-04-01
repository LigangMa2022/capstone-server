const knex = require("knex")(require("../knexfile"));

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

const getDiagnosisBySymptomAgeGender = async (req,res) => {
    try {
        //Due to limited samples in the database, update gender and age first
        await knex('diagnosis').update('Gender',req.params.gender).update('Age',req.params.age);
        //get symptomID based on symptomName entered by user
        const SymptomID_selected = await knex('diagnosis')
            .select('symptomID')
            .whereIn('SymptomID', function() {
            this.select('ID').from('symptoms').where('Name', 'like',`%${req.params.symptomName}%`);
            });
        const SymptomRecord_user = await knex('diagnosis').where('symptomID', SymptomID_selected[0].symptomID);
                                                            
        res.json(SymptomRecord_user);
    } catch (err) {
        res.status(400).json({
            message: `Error retrieving diagnosis result : ${err}`
        })
    }
}

// these two variables will be used for two submits from the front-end,
// then combine them and insert into one record of patient table in DB
let newPatientInfo = {};
let newPatientSymptoms = {};

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
  const selectedSymptoms = (req.body.selectedSymptoms).join(",");
  const inputSymptoms = req.body.inputSymptoms;
  newPatientSymptoms = inputSymptoms + selectedSymptoms;
  console.log("newPatientSymptoms: ",newPatientSymptoms);

  const newPatientData = {
    ...newPatientInfo,
    newPatientSymptoms
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
  try {
    //Due to limited samples in the database, update gender and age first, so that we have corresponding samples
    //await knex('diagnosis').update('Gender',newPatientInfo.Gender).update('Age',newPatientInfo.AgeGroup);
    //subquery to get symptomID based on symptomName entered by user
    const SymptomID_selected = await knex('diagnosis')
        .select('symptomID')
        .whereIn('SymptomID', function() {
        this.select('ID').from('symptoms').where('Name', 'LIKE',`%${newPatientSymptoms}%`);
        });
    const SymptomRecord_user = await knex('diagnosis').where('symptomID', SymptomID_selected[0].symptomID);
                                                        
    res.json(SymptomRecord_user);
    console.log("SymptomRecord_user: ", SymptomRecord_user);
  } catch (err) {
    res.status(400).json({
        message: `Error retrieving diagnosis result : ${err}`
    })
  }
}

module.exports = {
    getIssues,
    getSymptoms,
    postPatientInfo,
    postPatientSymptom,
    getDiagnosis
};