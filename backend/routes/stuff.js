const express = require('express');

//Création d'un router express 
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl =  require('../controllers/stuff');

//Enregistrement du routeur pour toutes les demandes effectuées vers l'API
router.get('/', auth, stuffCtrl.getAllSauce);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.post('/:id/like', auth, stuffCtrl.likeSauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);

module.exports = router;