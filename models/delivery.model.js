const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const DeliverySchema = new Schema({
    phoneClient: { type: String, required: true },
    idResto: { type: String, required: true },
    deliveryCoast: { type: Double, required: true }, 
    adresse: { type: String, required: true }, 
    commune: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Delivery = model('Delivery', DeliverySchema);