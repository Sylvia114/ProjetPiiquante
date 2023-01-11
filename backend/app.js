//Import d'express pour faciliter la création et la gestion des serveurs Node
const express = require('express');

//Import de Mongoose pour faciliter les interactions avec notre base de données MongoDB 
const mongoose = require('mongoose');

//Import de path pour accéder au path de notre serveur et traiter les requêtes vers la route /image, en rendant notre dossier images statique
const path = require('path');

//Import des routeurs stuff(pour les sauces) et user
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

//Création d'une constante app qui appelle la méthode express
const app = express();

//Chargement du contenu du fichier .env comme variables d'environnement 
require('dotenv').config();

//Connection à la database pour pouvoir créer des routes serveur
const uri = process.env.MONGO_URI;
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
	console.log('Connexion à MongoDB réussie !');
});

//Express prend toutes les requêtes qui ont comme Content-Type application/json et met à disposition leur body  directement sur l'objet req
app.use(express.json());

//Ajout d'un middleware pour permettre à toutes les demandes de toutes les origines d'accéder à l'API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//Routes attendues par le frontend
app.use('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);

//Ajout d'un gestionnaire de routage qui indique à Express qu'il faut gérer la ressource images de manière statique à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')));

//Export de la constant app pour pouvoir y accéder depuis les autres fichiers
module.exports = app;