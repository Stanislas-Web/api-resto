const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const orderSchema = new Schema({
    name: { type: String, required: true },
    idResto: { type: String, required: true },
    phoneClient: { type: String, required: true },
    qte: { type: Number, required: true },
    price: { type: Double, required: true },
    total: { type: Double, required: true },
    status: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Order = model('Order', orderSchema);