const express = require('express');
const fs = require('fs');
const router = express.Router();

// Route pour passer une commande
router.post('/', (req, res) => {
  const { userId, dishId } = req.body;

  // Validation des données
  if (!userId || !dishId) {
    return res.status(400).send("Utilisateur et plat requis");
  }

  // Lire le fichier pour récupérer les utilisateurs et les commandes
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send("Erreur de lecture du fichier");
    }

    const users = JSON.parse(data);
    
    // Vérifie si l'utilisateur existe
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    // Ajoute la commande (assure-toi d'avoir un tableau 'orders' dans chaque utilisateur)
    const newOrder = { userId, dishId, orderDate: new Date() };
    if (!user.orders) {
      user.orders = []; // Initialiser le tableau si ce n'est pas déjà fait
    }
    user.orders.push(newOrder);

    // Écrire les modifications dans le fichier
    fs.writeFile('data.json', JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).send("Erreur d'écriture dans le fichier");
      }
      res.status(201).send("Commande passée avec succès");
    });
  });
});

module.exports = router;