const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const translate = require('google-translate-api-x');
const app = express();

// Web server giữ bot thức 24/7
const PORT = process.env.PORT || 10000;
app.get("/", (req, res) => res.send("Bot is running!"));
app.listen(PORT, () => console.log(`Web server running on port ${PORT}`));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// BIẾN CÔNG TẮC (Mặc định là bật)
let isBotActive = true;

client.on("ready", () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase().trim();

  // LỆNH BẬT/TẮT BOT
  if (content === "!off") {
    isBotActive = false;
    return message.reply("💤 Bot đã đi ngủ. Gõ `!on` để gọi bot dậy nhé!");
  }
  if (content === "!on") {
    isBotActive = true;
    return message.reply("🚀 Bot đã sẵn sàng dịch thuật Việt ↔ Indo!");
  }

  // NẾU BOT ĐANG TẮT THÌ KHÔNG LÀM GÌ CẢ
  if (!isBotActive) return;

  // LOGIC DỊCH THUẬT CŨ
  try {
    const res = await translate(message.content, { to: 'vi' });
    const detectedLang = res.from.language.iso;

    if (detectedLang === 'vi') {
      const toIndo = await translate(message.content, { to: 'id' });
      await message.reply(`🇻🇳 ➡️ 🇮🇩: ${toIndo.text}`);
    } 
    else if (detectedLang === 'id') {
      await message.reply(`🇮🇩 ➡️ 🇻🇳: ${res.text}`);
    }
  } catch (err) {
    console.error("Lỗi dịch:", err);
  }
});

client.login(process.env.DISCORD_TOKEN);
