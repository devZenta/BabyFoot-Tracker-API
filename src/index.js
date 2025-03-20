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
    await notifyDiscord("user_created", {
      username: user.username,
      discordId: user.discordId,
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

// Création d'une équipe
app.post("/api/teams", async (req, res) => {
  const { name, playerIds } = req.body;

  try {
    const team = await prisma.team.create({
      data: {
        name,
        players: {
          create: playerIds.map((playerId) => ({
            player: { connect: { id: playerId } },
          })),
        },
      },
      include: {
        players: { include: { player: true } },
      },
    });
    await notifyDiscord("team_created", {
      teamName: team.name,
      players: team.players.map((p) => p.player.username),
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer toutes les équipes
app.get("/api/teams", async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: { 
        players: {
          include: { player: true }  
        }
      }
    });
    res.json(teams); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Création d'un match
app.post("/api/matchs", async (req, res) => {
  const { team1Id, team2Id, scoreTeam1, scoreTeam2 } = req.body;

  try {
    const winnerId = scoreTeam1 > scoreTeam2 ? team1Id : team2Id;

    const match = await prisma.match.create({
      data: {
        team1Id,
        team2Id,
        scoreTeam1,
        scoreTeam2,
        winnerId,
      },
    });

    // Mise à jour des statistiques pour chaque joueur de chaque équipe
    const updatePlayerStats = async (teamId, isWinner) => {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { players: { include: { player: true } } },
      });

      await Promise.all(
        team.players.map(async (teamPlayer) => {
          const player = teamPlayer.player;
          await prisma.player.update({
            where: { id: player.id },
            data: {
              games: player.games + 1,
              wins: player.wins + (isWinner ? 1 : 0),
              losses: player.losses + (isWinner ? 0 : 1),
              elo: player.elo + (isWinner ? 20 : -20),
            },
          });
        })
      );
    };

    await updatePlayerStats(team1Id, winnerId === team1Id);
    await updatePlayerStats(team2Id, winnerId === team2Id);

    res.json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer tous les matchs
app.get("/api/matchs", async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      include: {
        team1: true,  
        team2: true, 
      },
    });

    res.json(matches); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fonction utilitaire pour envoyer une requête HTTP au bot Discord
async function notifyDiscord(event, data) {
  try {
    await fetch(`${process.env.DISCORD_BOT_URL}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
    });
  } catch (error) {
    console.error("Error when sending to the Discord bot:", error.message);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server launched at http://localhost:${PORT}`));
