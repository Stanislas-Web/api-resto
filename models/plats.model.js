const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const platsSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    photoUrl: { type: String, required: true },
    idResto: { type: String, required: true },
    qte: { type: Number, required: true },
    price: { type: Double, required: true },
},{timestamps: true, versionKey: false });

module.exports.Plats = model('Plats', platsSchema);