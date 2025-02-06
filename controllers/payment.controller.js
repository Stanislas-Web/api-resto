
const { Category } = require("../models/category.model");
const { Payment } = require("../models/payment.model");
const { Reporting } = require("../models/reporting.model");
const path = require('path');

module.exports.callBackPayementCardSucces = async (req, res) => {

  const idResto = req.params.idResto;
  const phoneClient = req.params.phoneClient;
  const invoiceNumber = req.params.invoiceNumber;
  

  const findReporting = await Reporting.findOne({phoneClient: phoneClient, idResto: idResto, status: "pending", invoiceNumber: invoiceNumber});

  const update = {status: "success"};
  await Reporting.updateOne(findReporting, update);

  return res.sendFile(path.join(__dirname, '/success.html'));
};


module.exports.callBackPayementCardError = async (req, res) => {

  const idResto = req.params.idResto;
  const phoneClient = req.params.phoneClient;
  const invoiceNumber = req.params.invoiceNumber;

  const findReporting = await Reporting.findOne({phoneClient: phoneClient, idResto: idResto, status: "pending", invoiceNumber: invoiceNumber});

  const update = {status: "failure"};
  await Reporting.updateOne(findReporting, update);

  return res.sendFile(path.join(__dirname, '/error.html'));


};

