import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Muestra la lista de comandos disponibles y su sintaxis básica.");

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor("#E50914")
    .setTitle("💻 ARASAKA CORE — Documentación de Comandos")
    .setDescription(
      "Lista completa de comandos disponibles. Todos los comandos se ejecutan con el prefijo `$`."
    )
    .addFields(
      {
        name: "📦 **Base**",
        value:
          "`$ping` — Verifica el estado del bot.\n" +
          "`$help` — Muestra esta ayuda general.",
      },
      {
        name: "🧾 **Gestión de Tareas**",
        value:
          "`$register` — Crea una nueva tarea.\n" +
          "`$tareas` — Muestra tareas por estado o usuario.\n" +
          "`$completar` — Marca una tarea como finalizada.\n" +
          "`$tomar` — Asigna una tarea a un miembro.",
      },
      {
        name: "📢 **Alertas y Comunicación**",
        value:
          "`$alert` — Envía una notificación al canal designado.\n" +
          "`$info` — Muestra la versión y estado general del bot.",
      },
      {
        name: "⚙️ **Moderación (admin)**",
        value:
          "`$clear cantidad:<número>` — Elimina mensajes del canal.\n" +
          "`$clear usuario:@usuario` — Elimina mensajes de un usuario específico.",
      },
      {
        name: "🏆 **Ranking y Progreso**",
        value: "`$ranking` — Muestra el puntaje global (XP) del equipo.",
      }
    )
    .setFooter({
      text: "Arasaka Core v1.1.0 — Uso interno | Isometrical Systems",
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
