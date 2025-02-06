
const { Delivery } = require("../models/delivery.model");
const { Zone } = require("../models/zone.model");


module.exports.createDelivery = async (req, res) => {
  const {
    phoneClient,
    idResto,
    commune,
  } = req.body;

  const findZone = await Zone.findOne({ commune: commune })
  const delivery = new Delivery({
    phoneClient: phoneClient,
    idResto: idResto,
    adresse: "default",
    commune: commune,
    deliveryCoast: findZone.deliveryCoast
  });

  const result = await delivery.save();

  return res.status(200).send({
    message: "Save Delivery",
    data: result,
  });
};



module.exports.updateDelivery = async (req, res) => {
  const {
    adresse,
    idResto,
    phoneClient,
  } = req.body;



  const findDelivery = await Delivery.findOne({ idResto: idResto, phoneClient: phoneClient, adresse: "default" })

  if (findDelivery) {
    const update = { adresse: adresse };
    const result = await Delivery.updateOne(findDelivery, update);
    return res.status(201).send({
      message: "update Delivery datas successfully",
      data: result,
    });

  } else {

    const result = {
      modifiedCount: 0,
    };

    return res.status(201).send({
      message: "update Delivery datas successfully",
      data: result,
    });

  }



};





