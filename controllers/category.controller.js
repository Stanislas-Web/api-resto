
const { Category } = require("../models/category.model");
const { Resto } = require("../models/resto.model");

module.exports.createCategory = async (req, res) => {
  const {
    name,
    description,
    photoUrl,
    idResto,
  } = req.body;


  const category = new Category({
    name: name,
    description: description,
    photoUrl: photoUrl,
    idResto: idResto,
  });

  const result = await category.save();

  return res.status(200).send({
    message: "Save Category",
    data: result,
  });
};

module.exports.getAllCategories = async (req, res) => {
  const result = await Category.find();
  const sum = result.length;

  return res.status(200).send({
    message: "get "+sum+" Categories",
    data: result,
  });
};

module.exports.getCategoryByNumberId = async (req, res) => {

  const idResto = req.params.idResto;

  const resto = await Resto.findOne({ _id: idResto });

  console.log(resto);

  const result = await Category.find({ idResto: idResto });
  const sum = result.length;

  return res.status(200).send({
    message: "get "+sum+" avec "+ idResto,
    photoUrl: resto.photoUrl,
    restoName: resto.name,
    numberServer: resto.phoneUser,
    numberManager: resto.phoneManager,
    data: result,
  });

};