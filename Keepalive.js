const axios = require("axios");

module.exports = {
  config: {
    name: "keepalive",
    aliases: ["surveille", "actif", "eveille"],
    version: "2.0.0",
    author: "Ariel Aks Otaku",
    countDown: 5,
    role: 2,
    shortDescription: "Garde le bot actif — automatique",
    longDescription: "Surveille et réveille le bot toutes les 10 secondes",
    category: "Système",
    guide: "{p}keepalive"
  },

  onStart: async function({ api, event, args }) {
    let intervalId = null;
    let isActive = false;

    // 🛑 Arrêter la surveillance
    if (args[0] === "stop" || args[0] === "off") {
      if (global._keepAliveTimer) {
        clearInterval(global._keepAliveTimer);
        global._keepAliveTimer = null;
        return api.sendMessage("✅ Surveillance arrêtée ! Le bot peut se reposer.\n— Ariel Aks Otaku", event.threadID);
      }
      return api.sendMessage("⚠️ Aucune surveillance en cours.", event.threadID);
    }

    // ✅ Si déjà en cours
    if (global._keepAliveTimer) {
      return api.sendMessage("✅ Déjà en cours ! Le bot reste éveillé...\n⏱️ Toutes les 10 secondes\n— Ariel Aks Otaku", event.threadID);
    }

    // 🟢 Démarrer la surveillance
    isActive = true;

    // 🔗 URLs à surveiller (ajoutées automatiquement)
    const urls = [
      process.env.RENDER_EXTERNAL_URL,
      "https://mpm-bor.onrender.com"
    ].filter(Boolean); // Supprime les vides

    api.sendMessage(`🔁 SURVEILLANCE DÉMARRÉE ✅
⏱️ Vérification : toutes les 10 secondes
🌐 Cibles : ${urls.length} lien(s)
✅ Le bot ne s'endort JAMAIS !
— Ariel Aks Otaku`, event.threadID);

    // ⏱️ Toutes les 10 secondes
    global._keepAliveTimer = setInterval(async () => {
      for (const url of urls) {
        try {
          await axios.get(url, { timeout: 7000 });
          console.log(`✅ Éveillé — ${new Date().toLocaleTimeString()}`);
        } catch (err) {
          console.log(`🔄 Réveil — ${url}`);
          try { await axios.get(url); } catch (e) {}
        }
      }
    }, 10000); // 10 secondes
  }
};
