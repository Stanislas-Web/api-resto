
const { Resto } = require("../models/resto.model");

module.exports.createResto = async (req, res) => {
  const {
    name,
    description,
    category,
    photoUrl,
    numberId,
    address,
    phoneManager,
    phoneUser,
    phoneBot,
    password,
    rate,
    table,
    sign,
    localCurrency,

  } = req.body;

  const resto = new Resto({
    name: name,
    description: description,
    category: category,
    photoUrl: photoUrl,
    numberId: numberId,
    address: address,
    phoneManager: phoneManager,
    phoneUser: phoneUser,
    phoneBot: phoneBot,
    password: password,
    rate: rate,
    table: table,
    sign: sign,
    localCurrency: localCurrency,
  });

  const result = await resto.save();

  return res.status(200).send({
    message: "Save Resto",
    data: result,
  });
};

module.exports.getAllRestos = async (req, res) => {
  const result = await Resto.find();

  return res.status(200).send({
    message: "get all Resto",
    data: result,
  });
};
