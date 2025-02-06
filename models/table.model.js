const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const tableSchema = new Schema({
    no: { type: String, required: true },
    idResto: { type: String, required: true},
    phoneClient: { type: String, required: true},
},{timestamps: true, versionKey: false });

module.exports.Table = model('Table', tableSchema);