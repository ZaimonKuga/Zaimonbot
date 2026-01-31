const fetch = require("node-fetch");
console.log("START BOT FILE");

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

const { Client, GatewayIntentBits } = require("discord.js");

console.log("BEFORE CREATE CLIENT");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log("AFTER CREATE CLIENT");
console.log("TOKEN EXISTS?", !!process.env.DISCORD_TOKEN);

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  console.log("MSG:", message.content);

  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: message.content,
        source: "auto",
        target: "vi",
        format: "text",
      }),
    });

    const data = await res.json();
    if (!data.translatedText) return;

    if (data.translatedText.toLowerCase() === message.content.toLowerCase()) {
      const res2 = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: message.content,
          source: "auto",
          target: "id",
          format: "text",
        }),
      });

      const data2 = await res2.json();
      await message.reply(data2.translatedText);
    } else {
      await message.reply(data.translatedText);
    }
  } catch (err) {
    console.error("TRANSLATE ERROR:", err);
    await message.reply("❌ Lỗi dịch");
  }
});

console.log("BEFORE LOGIN");
client.login(process.env.DISCORD_TOKEN);
console.log("AFTER LOGIN CALL");
