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

const getDiagnosis = async (req,res) => {
    try {

    } catch (err) {
        message: ""
    }
}







module.exports = {
    getIssues,
    getSymptoms,
};