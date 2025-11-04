import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import path from "path";
import url from "url";
import { readJSON } from "../utils/jsonHandler.js";

export const data = new SlashCommandBuilder()
  .setName("tareas")
  .setDescription("Ver tareas registradas.")
  .addStringOption(opt =>
    opt
      .setName("estado")
      .setDescription("Filtrar por estado: pendiente | en_progreso | completada")
      .setRequired(false)
  );

export async function execute(interaction) {
  const estadoFiltro = interaction.options.getString("estado") || null;

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const dataPath = path.join(__dirname, "../data/tareas.json");

  const tareas = (await readJSON(dataPath)) || [];

  const filtradas = estadoFiltro
    ? tareas.filter(t => t.status === estadoFiltro)
    : tareas;

  if (filtradas.length === 0) {
    await interaction.reply({
      content: "No se encontraron tareas con ese criterio.",
      ephemeral: true,
    });
    return;
  }

  const fields = filtradas.slice(0, 10).map(t => ({
    name: `${t.titulo} [${t.status}]`,
    value:
      `ID: ${t.id}\n` +
      `Proyecto: ${t.proyecto}\n` +
      `XP: ${t.xp}\n` +
      `Responsable: ${t.responsable || "Sin asignar"}`,
  }));

  const embed = new EmbedBuilder()
    .setColor(0x0f7cff)
    .setTitle("Listado de tareas")
    .addFields(fields)
    .setFooter({ text: "Arasaka Core v1.1.0" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
