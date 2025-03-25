const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

prisma.$connect()
    .then(() => console.log("✅ Connexion à la base de données réussie"))
    .catch(err => console.error("❌ Erreur de connexion Prisma :", err));

module.exports = prisma;