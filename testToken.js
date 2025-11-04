import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
