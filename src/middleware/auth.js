const verifyApiKey = (req, res, next) => {
    const apiKey = req.header("x-api-key");
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

module.exports = verifyApiKey;