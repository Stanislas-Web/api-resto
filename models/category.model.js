const {Schema, model} = require('mongoose');
const Double = require('@mongoosejs/double');

const CategorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String, required: true },
    idResto: { type: String, required: true },
},{timestamps: true, versionKey: false });

module.exports.Category = model('Category', CategorySchema);