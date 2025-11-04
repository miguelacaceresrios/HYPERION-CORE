import { SlashCommandBuilder } from "discord.js";
import path from "path";
import url from "url";
import { readJSON, writeJSON } from "../utils/jsonHandler.js";

export const data = new SlashCommandBuilder()
  .setName("registrar")
  .setDescription("Registrar una nueva tarea en el sistema.")
  .addStringOption(opt =>
    opt
      .setName("titulo")
      .setDescription("Título corto de la tarea")
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt
      .setName("proyecto")
      .setDescription("Nombre del proyecto asociado")
      .setRequired(true)
  )
  .addIntegerOption(opt =>
    opt
      .setName("xp")
      .setDescription("XP asignada a esta tarea")
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt
      .setName("descripcion")
      .setDescription("Descripción opcional / detalles técnicos")
      .setRequired(false)
  );

export async function execute(interaction) {
  const titulo = interaction.options.getString("titulo");
  const proyecto = interaction.options.getString("proyecto");
  const xp = interaction.options.getInteger("xp");
  const descripcion = interaction.options.getString("descripcion") || "";

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const dataPath = path.join(__dirname, "../data/tareas.json");

  const tareas = (await readJSON(dataPath)) || [];

  const nuevaTarea = {
    id: Date.now(),
    proyecto,
    titulo,
    descripcion,
    status: "pendiente",
    xp,
    responsable: null,
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: null,
  };

  tareas.push(nuevaTarea);
  await writeJSON(dataPath, tareas);

  await interaction.reply({
    content:
      `[ARASAKA] Tarea registrada.\n` +
      `ID: ${nuevaTarea.id}\n` +
      `Proyecto: ${proyecto}\n` +
      `Estado inicial: pendiente`,
    ephemeral: true,
  });
}
