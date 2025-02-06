
const { Order } = require("../models/order.model");
const { Facture } = require("../models/facture.model");



module.exports.getPathByPhoneNumberAndIdNumber = async (req, res) => {
  const {
    idResto,
    phoneClient,
  } = req.body;

  const findInvoiceByPhoneNumer = await Facture.find({ idResto: idResto, phoneClient: phoneClient })
    .sort({ createdAt: -1 }) // Trie par date de création décroissante
    .limit(1); // Limite les résultats à un seul enregistrement

  return res.status(200).send({
    message: "get Invoice by phone number",
    data: findInvoiceByPhoneNumer[0], // Sélectionne le premier élément du tableau
  });
};



module.exports.checkOrder = async (req, res) => {
  const {
    qte,
    numberId,
    phoneClient,
  } = req.body;

  const findOrder = await Order.findOne({ numberId: numberId, phoneClient: phoneClient, status: "pending" })

  console.log(findOrder);

  const totalPrice = findOrder.price * parseInt(qte);

  const update = { qte: qte, total: totalPrice, status: "success" };
  const result = await Order.updateOne(findOrder, update);
  return res.status(201).send({
    message: "update Order datas successfully",
    data: result,
  });

};




