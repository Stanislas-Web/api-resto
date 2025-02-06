const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const paymentSchema = new Schema({
    numberId: { type: String, required: true },
    phoneClient: { type: String, required: true },
    amount: { type: Double, required: true },
},{timestamps: true, versionKey: false });

module.exports.Payment = model('Payment', paymentSchema);