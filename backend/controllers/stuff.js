//Import du modèle sauce depuis le fichier sauce.js
const Sauce = require('../models/Sauce');

//Import de fs donne accès aux fonctions qui nous permettent de modifier le système de fichiers (dont supprimer les fichiers).
const fs = require('fs');

//Créer une sauce (Enregistre des sauces dans la base de données) (POST)
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

//Mettre à jour une sauce existante (PUT)
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
       ...JSON.parse(req.body.sauce),
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
   
   delete sauceObject._userId;
   Sauce.findOne({_id: req.params.id})
       .then((sauce) => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Sauce modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
       .catch((error) => {
           res.status(400).json({ error });
       });
  };

//Supprimer une sauce (DELETE)
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
      if (sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
  };

//Récupére une sauce spécifique (GET)
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};

//Récupére la liste de sauce en vente (toutes les sauces) (GET)
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

//Définit le statut « Like » pour le userId fourni (POST)
exports.likeSauce = (req, res, next) => {    
//Si like = 1, l'utilisateur aime (= like) la sauce
    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: {usersLiked: req.body.userId} }) //$inc opérateur va incrémenter like et $push va ajouter l'id du user au tableau usersLiked
              .then((sauce) => res.status(200).json({message: 'Like ajouté'}))
              .catch(error => res.status(400).json({error}))
      } 
//Si like = -1, l'utilisateur n'aime pas (=dislike) la sauce
      else if (req.body.like === -1) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
              .then((sauce) => res.status(200).json({message: 'Dislike ajouté'}))
              .catch(error => res.status(400).json({error}))
      } 
//Si like = 0, l'utilisateur annule son like ou son dislike (au clic, -1 est ajouté ce qui devient 0)    
      else {
          Sauce.findOne({_id: req.params.id})
              .then(sauce => {
                    //Supprime le like
                  if (sauce.usersLiked.includes(req.body.userId)) {  
                      Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }) //$pull supprime du tableau l'id du user
                          .then((sauce) => { res.status(200).json({message: 'Like supprimé'}) })
                          .catch(error => res.status(400).json({error}))
                  } 
                  //Supprime le dislike
                  else if (sauce.usersDisliked.includes(req.body.userId)) {
                      Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                          .then((sauce) => { res.status(200).json({message: 'Dislike supprimé'})})
                          .catch(error => res.status(400).json({error}))
                  }
              })
              .catch(error => res.status(400).json({error}))
      }
};




