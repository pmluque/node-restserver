// Requisitos: 
//              moongoose
//              https://www.npmjs.com/package/mongoose-unique-validator
//
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    description: { type: String, unique: true, required: [true, 'Description is required'] },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('category', categorySchema); // nombre físico para la colección "category"