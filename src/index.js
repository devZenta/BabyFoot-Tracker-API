import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Babyfoot en ligne !");
});

// Exemple de route pour ajouter un utilisateur
app.post("/users", async (req, res) => {
  const { name, discordId } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, discordId },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
