var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    unitPrice: { type: Number, required: [true, 'El precio únitario es necesario'] },
    description: { type: String, required: false },
    stock: { type: Boolean, required: true, default: true },
    img: { type: String, required: false },
    category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
});


module.exports = mongoose.model('product', productSchema);