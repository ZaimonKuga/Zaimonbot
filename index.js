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

  console.log("Tin nhắn gốc:", message.content);

  try {
    // Dịch câu chat sang tiếng Việt
    const res = await translate(message.content, { to: 'vi' });

    // Nếu câu gốc đã là tiếng Việt (dịch xong không đổi), dịch thử sang tiếng Anh
    if (res.text.toLowerCase() === message.content.toLowerCase()) {
      const resEn = await translate(message.content, { to: 'en' });
      return await message.reply(`🇬🇧 English: ${resEn.text}`);
    }

    // Trả lời câu đã dịch
    await message.reply(`🇻🇳 Tiếng Việt: ${res.text}`);
  } catch (err) {
    console.error("Lỗi Google Translate:", err);
    await message.reply("❌");
  }
});

client.login(process.env.DISCORD_TOKEN);
