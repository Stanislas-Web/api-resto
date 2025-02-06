
const { Zone } = require("../models/zone.model");


module.exports.createZone = async (req, res) => {
  const {
    commune,
    idResto,
    deliveryCoast,
    district,
  } = req.body;

  const zone = new Zone({
    commune: commune,
    idResto: idResto,
    district: district,
    deliveryCoast: deliveryCoast,
  });

  const result = await zone.save();

  return res.status(200).send({
    message: "Save Zone",
    data: result,
  });
};


module.exports.getZoneByNumberId = async (req, res) => {

  let idResto = req.params.idResto;

  // const result = await Zone.find({ idResto: idResto }).sort({ commune: 1 });
  const result = await Zone.find().sort({ commune: 1 });


  const sum = result.length;

  return res.status(200).send({
    message: "get "+sum+" zones with "+ idResto,
    data: result,
  });

};