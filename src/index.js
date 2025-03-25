const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const verifyApiKey = require('./middleware/auth');
const prisma = require('./prisma/prismaClient');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(verifyApiKey);

app.get("/api", (req, res) => {
  res.json({ 
    status: "online",
    message: "Babyfoot Tracker API is up and running!",
    version: "0.1.0",
    documentation: "/api/docs" // Dispoible dans la prochaine version de l'API
  });
});

// Get all players
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single player (if there's only one player in the database)
app.get("/api/player", async (req, res) => {
  try {
    // Get the first player from the database
    const player = await prisma.user.findFirst();
    
    if (!player) {
      return res.status(404).json({ error: "No players found" });
    }
    
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
      const users = await prisma.User.findMany(); // Assurez-vous que votre modèle Prisma s'appelle bien "User"
      res.json(users);
  } catch (error) {
    console.error("Erreur Prisma :", error); 
    res.status(500).json({ error: error.message });
  }
});

// Récupération des informations d'un utilisateur
/*app.get("/api/users/:id", async (req, res) => {
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
});*/


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server launched at http://localhost:${PORT}`));
