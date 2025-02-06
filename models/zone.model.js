const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const ZoneSchema = new Schema({
    commune: { type: String, required: true },
    district: { type: String, required: true },
    idResto: { type: String, required: true },
    deliveryCoast: { type: Double, required: true }, 
},{timestamps: true, versionKey: false });

module.exports.Zone = model('Zone', ZoneSchema);