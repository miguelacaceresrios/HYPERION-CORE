import { SlashCommandBuilder } from "discord.js";
import { readJSON, writeJSON } from "../utils/jsonHandler.js";

export const data = new SlashCommandBuilder()
  .setName("completar")
  .setDescription("Marca una tarea como completada y actualiza el registro.")
  .addIntegerOption(option =>
    option
      .setName("id")
      .setDescription("ID numérico de la tarea a cerrar")
      .setRequired(true)
  );

export async function execute(interaction) {
  const id = interaction.options.getInteger("id");

  // cargar tareas actuales
  const tareas = await readJSON("data/tareas.json");

  // buscar la tarea
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) {
    return interaction.reply({
      content: "❌ No se encontró una tarea con ese ID.",
      ephemeral: true,
    });
  }

  // si ya estaba completada evitamos doble update
  if (tarea.estado === "completada") {
    return interaction.reply({
      content: `⚠️ La tarea **${tarea.titulo}** ya estaba marcada como completada.`,
      ephemeral: true,
    });
  }

  // marcar como completada
  tarea.estado = "completada";
  tarea.fecha_actualizacion = new Date().toISOString();

  // persistir
  await writeJSON("data/tareas.json", tareas);

  // responder
  await interaction.reply({
    content: `✅ Tarea **${tarea.titulo}** (ID ${tarea.id}) marcada como completada.`,
    ephemeral: true,
  });
}
