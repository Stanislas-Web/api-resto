
const { Plats } = require("../models/plats.model");
const { Category } = require("../models/category.model");

module.exports.createPlats = async (req, res) => {
  const {
    name,
    description,
    category,
    photoUrl,
    idResto,
    qte,
    price,
  } = req.body;

  const plats = new Plats({
    name: name,
    description: description,
    category: category,
    photoUrl: photoUrl,
    idResto: idResto,
    qte: qte,
    price: price,
  });

  const result = await plats.save();

  return res.status(200).send({
    message: "Save Plats",
    data: result,
  });
};

module.exports.getAllPlats = async (req, res) => {
  const result = await Plats.find();

  return res.status(200).send({
    message: "get all Plats",
    data: result,
  });
};

module.exports.getAllPlatsByNameCategoryWithIdNumber = async (req, res) => {

  const idResto = req.params.idResto;
  const category = req.params.category;

  const result = await Plats.find({ idResto: idResto, category: category});

  return res.status(200).send({
    message: "get Plats by "+category+" and "+idResto,
    data: result,
  });
};
