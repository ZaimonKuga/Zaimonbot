const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const translate = require('google-translate-api-x');
const app = express();

// Giữ cho Render không ngủ
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

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    // Thử dịch sang tiếng Việt trước để kiểm tra ngôn ngữ gốc
    const checkLang = await translate(message.content, { to: 'vi' });

    // Nếu câu gốc KHÔNG PHẢI tiếng Việt -> Dịch nó về tiếng Việt
    if (checkLang.text.toLowerCase() !== message.content.toLowerCase()) {
      return await message.reply(`🇮🇩 ➡️ 🇻🇳: ${checkLang.text}`);
    } 
    
    // Nếu câu gốc LÀ tiếng Việt -> Dịch sang tiếng Indonesia
    const resIndo = await translate(message.content, { to: 'id' });
    await message.reply(`🇻🇳 ➡️ 🇮🇩: ${resIndo.text}`);

  } catch (err) {
    console.error("Lỗi dịch thuật:", err);
    await message.reply("❌");
  }
});

client.login(process.env.DISCORD_TOKEN);
