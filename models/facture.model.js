const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const factureSchema = new Schema({
    idResto: { type: String, required: true },
    phoneClient: { type: String, required: true },
    pathPDF: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Facture = model('Facture', factureSchema);