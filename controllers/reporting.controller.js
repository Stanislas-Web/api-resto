

const { Reporting } = require("../models/reporting.model");


module.exports.getAllReport = async (req, res) => {
  const result =  await Reporting.find();

  return res.status(200).send({
    message: "get all reports",
    data: result,
  });
};


