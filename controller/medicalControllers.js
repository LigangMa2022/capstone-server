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

const getDiagnosisByIdAgeGender = async (req,res) => {
    try {
        const data1 = await knex("diagnosis").update({ 'Gender': req.params.gender })
                                             .update({ 'Age': req.params.age })
                                             .where({ 'SymptomID': req.params.symptomID });
        
        const data2 = await knex("diagnosis").where({ 'SymptomID': req.params.symptomID })
                                             .where({ 'Age': req.params.age })
                                             .andWhere({ 'Gender': req.params.gender });
        res.status(200).json(data2);
    } catch (err) {
        res.status(400).json({
            message: `Error retrieving diagnosis result : ${err}`
        })
    }
}

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



module.exports = {
    getIssues,
    getSymptoms,
    getDiagnosisByIdAgeGender,
    getDiagnosisBySymptomAgeGender,
};