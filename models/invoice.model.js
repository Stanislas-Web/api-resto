const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const invoiceSchema = new Schema({
    title: { type: String, required: true },
    idResto: { type: String, required: true },
    phoneClient: { type: String, required: true },
    namePDF: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Invoice = model('Invoice', invoiceSchema);