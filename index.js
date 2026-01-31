const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const translate = require('google-translate-api-x');
const app = express();

// Duy trì kết nối với Render để bot không ngủ
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
  console.log(`✅ Đã đăng nhập thành công: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // Không trả lời tin nhắn của bot khác
  if (message.author.bot) return;

  try {
    // Thử dịch để kiểm tra ngôn ngữ gốc
    const res = await translate(message.content, { to: 'vi' });
    const detectedLang = res.from.language.iso; // Lấy mã ngôn ngữ hệ thống nhận diện được

    console.log(`Tin nhắn: "${message.content}" - Ngôn ngữ: ${detectedLang}`);

    // CHỈ DỊCH NẾU LÀ TIẾNG VIỆT HOẶC TIẾNG INDONESIA
    if (detectedLang === 'vi') {
      // Nếu là tiếng Việt -> Dịch sang tiếng Indonesia
      const toIndo = await translate(message.content, { to: 'id' });
      await message.reply(`🇻🇳 ➡️ 🇮🇩: ${toIndo.text}`);
    } 
    else if (detectedLang === 'id') {
      // Nếu là tiếng Indonesia -> Dịch về tiếng Việt
      await message.reply(`🇮🇩 ➡️ 🇻🇳: ${res.text}`);
    }
    // Các trường hợp khác (như "huak chuak", tiếng Anh, v.v.) sẽ bị bỏ qua

  } catch (err) {
    console.error("Lỗi hệ thống dịch:", err);
  }
});

// Sử dụng biến môi trường DISCORD_TOKEN đã cài trên Render
client.login(process.env.DISCORD_TOKEN);
