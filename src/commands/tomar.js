import { SlashCommandBuilder } from "discord.js";
import path from "path";
import url from "url";
import { readJSON, writeJSON } from "../utils/jsonHandler.js";

export const data = new SlashCommandBuilder()
  .setName("tomar")
  .setDescription("Asignarte una tarea por ID.")
  .addIntegerOption(opt =>
    opt.setName("id")
      .setDescription("ID de la tarea a tomar.")
      .setRequired(true)
  );

export async function execute(interaction) {
  const id = interaction.options.getInteger("id");
  const usuario = interaction.user.username;

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const tareasPath = path.join(__dirname, "../data/tareas.json");
  const tareas = await readJSON(tareasPath);

  const tarea = tareas.find(t => t.id === id);
  if (!tarea)
    return interaction.reply({ content: "❌ No se encontró la tarea.", ephemeral: true });

  tarea.responsable = usuario;
  tarea.status = "en progreso";
  tarea.fecha_actualizacion = new Date().toISOString();

  await writeJSON(tareasPath, tareas);
  await interaction.reply({
    content: `✅ Tarea **${tarea.titulo}** tomada por ${usuario}.`,
    ephemeral: true,
  });
}
