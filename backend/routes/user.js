//Importation d'express pour créer le router
const express = require('express');

//Création du routeur
const router = express.Router();

//Import du controlleur pour pouvoir associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

//Création de routes pour que le user puisse créer un compte, se connecter et disposer d'un token valide
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

//Export du router pour pouvoir l'importer dans app.js
module.exports = router;