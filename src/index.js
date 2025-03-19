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
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, elo, games, wins, losses, teams } = req.body;

  try {
    const user = await prisma.player.update({
      where: { id: String(id) },
      data: {
        username,
        elo,
        games,
        wins,
        losses,
        teams: {
          set: teams ? teams.map((team) => ({ id: team.id })) : [],
        },
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupération des utilisateurs pour le leaderboard 
app.get("/api/leaderboard", async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      orderBy: { elo: "desc" }, 
    });

    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server launched at http://localhost:${PORT}`));
