const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
//const { PrismaClient } = require('@prisma/client');

dotenv.config();
const app = express();
//const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ 
    status: "online",
    message: "Babyfoot Tracker API is up and running!",
    version: "0.1.0",
    documentation: "/api/docs" // Dispoible dans la prochaine version de l'API
  });
});

// Création d'un utilisateur
app.post("/users", async (req, res) => {
  const { name, discordId } = req.body;
  try {
    /*const user = await prisma.user.create({
      data: { name, discordId },
    });*/
    //res.json(user);
    res.json({ name, discordId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modification d'un utilisateur
// Récupération des utilisateurs pour le leaderboard 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
