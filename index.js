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
const translate = require("@vitalets/google-translate-api");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.DISCORD_TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    // Nếu là tiếng Việt → dịch sang Indonesia
    if (/[àáạảãâầấậẩẫăằắặẳẵđèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹ]/i.test(message.content)) {
      const res = await translate(message.content, { to: "id" });
      message.reply(res.text);
    }
    // Ngược lại → dịch sang tiếng Việt
    else {
      const res = await translate(message.content, { to: "vi" });
      message.reply(res.text);
    }
  } catch (err) {
    console.error(err);
  }
});

client.login(TOKEN);
