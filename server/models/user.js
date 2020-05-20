// Requisitos: 
//              moongoose
//              https://www.npmjs.com/package/mongoose-unique-validator
//
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let allowedRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es válido'
};

let userSchema = new Schema({
    name: { type: String, required: [true, 'Field name is required'] },
    email: { type: String, required: [true, 'Field email is required'], unique: true },
    password: { type: String, required: [true, 'Field password is required'] },
    img: { type: String, required: false },
    role: { type: String, default: 'USER_ROLE', enum: allowedRoles },
    status: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

// Suprimir la propiedad Password por ser campo crítico
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('user', userSchema); // nombre físico para la colección "user"