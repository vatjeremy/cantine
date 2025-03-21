const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let users = []; // Tableau pour stocker les utilisateurs

// Endpoint principal pour afficher le message de bienvenue
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'application Cantine !');
});

// Endpoint pour créer un nouvel utilisateur
app.post('/api/users', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }
    
    // Vérifie si l'utilisateur existe déjà
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'Utilisateur déjà existant.' });
    }

    // Ajoute l'utilisateur au tableau
    const newUser = { email, password }; // À améliorer en ne stockant pas le mot de passe en clair
    users.push(newUser);
    res.status(201).json(newUser);
});

// Endpoint pour obtenir tous les utilisateurs
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Endpoint pour obtenir un utilisateur par email
app.get('/api/users/:email', (req, res) => {
    const { email } = req.params;
    const user = users.find(user => user.email === email);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
});

// Endpoint pour supprimer un utilisateur
app.delete('/api/users/:email', (req, res) => {
    const { email } = req.params;
    users = users.filter(user => user.email !== email);
    res.status(204).send(); // No Content
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Route pour obtenir tous les plats
app.get('/api/plats', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).send("Erreur de lecture du fichier");
        return;
      }
      const jsonData = JSON.parse(data);
      res.send(jsonData.plats);
    });
  });
  
  // Route pour passer une commande
  app.post('/api/commandes', (req, res) => {
    const { userId, platId, date } = req.body;
  
    fs.readFile('data.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).send("Erreur de lecture du fichier");
        return;
      }
  
      const jsonData = JSON.parse(data);
      const user = jsonData.users.find(u => u.id === userId);
      const plat = jsonData.plats.find(p => p.id === platId);
  
      if (!user) {
        return res.status(404).send("Utilisateur non trouvé");
      }
      if (!plat) {
        return res.status(404).send("Plat non trouvé");
      }
      if (user.cagnotte < plat.prix) {
        return res.status(400).send("Cagnotte insuffisante");
      }
  
      // Débiter la cagnotte
      user.cagnotte -= plat.prix;
  
      // Ajouter la commande
      user.commandes.push({ plat: plat.nom, date });
  
      // Écrire les données mises à jour dans le fichier
      fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          res.status(500).send("Erreur d'écriture du fichier");
          return;
        }
        res.send("Commande passée avec succès !");
      });
    });
  });