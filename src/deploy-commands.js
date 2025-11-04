import fs from "fs";
import path from "path";
import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const commands = [];
const foldersPath = path.join(process.cwd(), "src", "commands");
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = await import(`file://${filePath}`);

  // solo agregar los comandos slash (con toJSON)
  if (command.data && typeof command.data.toJSON === "function") {
    commands.push(command.data.toJSON());
    console.log(`📦 Slash registrado: ${command.data.name}`);
  } else {
    console.log(`⚙️ Comando local omitido: ${file}`);
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

try {
  console.log("🧠 Iniciando despliegue de comandos...");
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log(`✅ ${commands.length} comandos slash desplegados correctamente.`);
} catch (error) {
  console.error("❌ Error al desplegar los comandos:", error);
}
