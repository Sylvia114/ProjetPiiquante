const mongoose = require('mongoose');

//on importe MUV pour ne pas avoir deux utilisateurs identiques (appliqué à l'adresse email avec unique)
const uniqueValidator = require('mongoose-unique-validator');

//on crée le modèle user avec la valeur unique pour que deux utilisateurs ne puissent pas partager la même adresse e-mail
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

//on compléte le plugin mongoose qui vérifie UNIQUE
userSchema.plugin(uniqueValidator);

//on exporte le schéma sous forme de model
module.exports = mongoose.model('User', userSchema);