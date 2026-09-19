const axios = require("axios");

module.exports = {
  config: {
    name: "keepalive",
    aliases: ["surveille", "actif"],
    version: "1.0.0",
    author: "Ariel Aks Otaku",
    countDown: 5,
    role: 2, // Seulement administrateur
    shortDescription: "Garde le bot actif sur Render",
    longDescription: "Surveille et réveille le bot toutes les 10 secondes",
    category: "Système",
    guide: "{p}keepalive"
  },

  onStart: async function({ api, event, args }) {
    const URL = "https://mpm-bor.onrender.com";
    let isRunning = false;
    let intervalId = null;

    if (args[0] === "stop") {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        return api.sendMessage("✅ Surveillance arrêtée !", event.threadID);
      }
      return api.sendMessage("⚠️ Aucune surveillance en cours.", event.threadID);
    }

    if (isRunning) {
      return api.sendMessage("✅ Déjà en cours ! Le bot reste éveillé...", event.threadID);
    }

    isRunning = true;

    api.sendMessage(`🔁 Lancement de la surveillance...
📍 URL : ${URL}
⏱️ Vérification : toutes les 10 secondes
✅ Le bot restera TOUJOURS actif !
— Ariel Aks Otaku`, event.threadID);

    // Toutes les 10 secondes = 10000 ms
    intervalId = setInterval(async () => {
      try {
        const res = await axios.get(URL, { timeout: 8000 });
        console.log(`✅ [${new Date().toLocaleTimeString()}] Bot en ligne — Statut: ${res.status}`);
      } catch (err) {
        console.log(`⚠️ [${new Date().toLocaleTimeString()}] Réveil du bot...`);
        try {
          await axios.get(URL);
        } catch (e) {}
      }
    }, 10000); // ⏱️ 10 secondes exactement
  }
};
        
