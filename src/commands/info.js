import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Muestra información general del bot.");

export async function execute(interaction) {
  const uptime = process.uptime();
  const minutos = Math.floor(uptime / 60);
  const horas = Math.floor(minutos / 60);

  const embed = new EmbedBuilder()
    .setColor("#E50914")
    .setTitle("ℹ️ Información del sistema — Arasaka Core")
    .addFields(
      { name: "Versión", value: "v1.1.0", inline: true },
      { name: "Tiempo activo", value: `${horas}h ${minutos % 60}m`, inline: true },
      { name: "Desarrollado por", value: "Isometrical Systems", inline: false }
    )
    .setFooter({ text: "Uso interno corporativo" });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
