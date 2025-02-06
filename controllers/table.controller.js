
const { Resto } = require("../models/resto.model");
const { Table } = require("../models/table.model");


module.exports.getTableByRestoAndNumberId = async (req, res) => {

  const idResto = req.params.idResto;

  let tablesResto = [];

  const getNumberOfTable = await Resto.findOne({ idResto: idResto });


  const totalTable = getNumberOfTable.table;

  for (let i = 0; i < totalTable; i++) {
    const object = {
      "number": i + 1,
      "idResto": idResto,
    };

    tablesResto.push(object);
  }
  return res.status(200).send({
    message: "get all 10",
    data: tablesResto,
  });
};


module.exports.createTable = async (req, res) => {

  const { no, idResto, phoneClient } = req.body;

  const table = new Table({
    no: no,
    idResto: idResto,
    phoneClient: phoneClient,
  });


  const result = await table.save();


  return res.status(200).send({
    message: "create table",
    data: result,
  });
};
