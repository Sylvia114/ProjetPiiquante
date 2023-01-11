//Import de Mongoose qui permet d'implémenter un schéma strict de données (modèle) 
const mongoose = require('mongoose');

//création d'un modèle de données sauce
const sauceSchema = mongoose.Schema({
    userId : { type: String, required: true },
    name : { type: String, required: true },
    manufacturer : { type: String, required: true },
    description : { type: String, required: true },
    mainPepper : { type: String, required: true },
    imageUrl : { type: String, required: true },
    heat : { type: Number, required: true },
    likes : { type: Number, required: true },
    dislikes : { type: Number, required: true },
    usersLiked : { type: Array, required: true }, //tableau des identifiants des utilisateurs qui ont aimé
    usersDisliked : { type: Array, required: true } //tableau des identifiants des utilisateurs qui n'ont pas aimé
    
});

//on exporte le schéma sous forme de model
module.exports = mongoose.model('Sauce', sauceSchema);