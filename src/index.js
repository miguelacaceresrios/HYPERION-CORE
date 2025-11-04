import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// === CLIENTE PRINCIPAL ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// === CARGA AUTOMÁTICA DE COMANDOS ===
const commandsPath = path.join(process.cwd(), "src", "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const { data, execute } = await import(`./commands/${file}`);
  client.commands.set(data.name, { data, execute });
  console.log(`📦 Comando cargado: ${data.name}`);
}

// === EVENTO READY ===
client.once("ready", () => {
  console.log(`✅ Arasaka Core conectado como ${client.user.tag}`);
});

// === SLASH COMMANDS ===
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error ejecutando /${interaction.commandName}:`, error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "⚠️ Hubo un error ejecutando este comando.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "⚠️ Hubo un error ejecutando este comando.",
        ephemeral: true,
      });
    }
  }
});

// === PREFIJO TRADICIONAL ===
const PREFIX = "$";

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const command = client.commands.get(cmdName);
  if (!command) return;

  try {
    await command.execute({
      isChatInputCommand: false,
      args,
      channel: message.channel,
      guild: message.guild,
      member: message.member,
      user: message.author,
      reply: msg => message.reply(msg),
    });
  } catch (err) {
    console.error(`❌ Error ejecutando $${cmdName}:`, err);
    message.reply("⚠️ Error ejecutando el comando.");
  }
});

// === LOGIN ===
client.login(process.env.TOKEN);
