const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const restoSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    photoUrl: { type: String, required: true },
    numberId: { type: String, required: true },
    address: { type: String, required: true },
    phoneManager: { type: String, required: true },
    phoneUser: { type: String, required: true },
    phoneBot: { type: String, required: true },
    password: { type: String, required: true},
    rate: { type: Double, required: true },
    table: { type: Number, required: true },
    sign:{ type: String, required: true},
    localCurrency:{ type: String, required: true},
},{timestamps: true, versionKey: false });

module.exports.Resto = model('Resto', restoSchema);