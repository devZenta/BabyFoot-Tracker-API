const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ 
    status: "online",
    message: "Babyfoot Tracker API is up and running!",
    version: "0.1.0",
    documentation: "/api/docs" // Dispoible dans la prochaine version de l'API
  });
});

// Création d'un utilisateur
app.post("/api/users", async (req, res) => {
  const { username, discordId} = req.body;
  try {
    const user = await prisma.player.create({
      data: { username, discordId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupération des informations d'un utilisateur
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.player.findUnique({
      where: { id: String(id) }, 
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Modification d'un utilisateur
// Récupération des utilisateurs pour le leaderboard 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server launched at http://localhost:${PORT}`));
