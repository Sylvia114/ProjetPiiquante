//Import de jsonwebtoken pour créer et vérifier les tokens d'authentification
const jwt = require('jsonwebtoken');

//Récupération du TOKEN composé de BEARER et du token, on peut alors le récupérer en enlevant BEARER
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};