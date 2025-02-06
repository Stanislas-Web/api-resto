const { Schema, model } = require('mongoose');
const Double = require('@mongoosejs/double');

const ReportingSchema = new Schema({
    phoneClient: { type: String, required: true },
    numberId: { type: String, required: true },
    table: { type: String, required: true },
    deliveryCoast: { type: Double, required: true },
    amountUSD: { type: Double, required: true },
    amountCDF: { type: Double, required: true },
    invoiceNumber: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true, versionKey: false });

module.exports.Reporting = model('Reporting', ReportingSchema);