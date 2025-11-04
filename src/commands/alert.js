import { SlashCommandBuilder, ChannelType, EmbedBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("alert")
  .setDescription("Publica un aviso o noticia importante en un canal designado.")
  .addStringOption(option =>
    option.setName("mensaje").setDescription("Texto del aviso").setRequired(true)
  )
  .addChannelOption(option =>
    option
      .setName("canal")
      .setDescription("Canal donde se publicará el aviso")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
  );

export async function execute(interaction) {
  const mensaje = interaction.options.getString("mensaje");
  const canal = interaction.options.getChannel("canal");

  const embed = new EmbedBuilder()
    .setColor("#E50914")
    .setTitle("📢 ALERTA — Comunicación interna")
    .setDescription(mensaje)
    .setFooter({ text: "Arasaka Core • Isometrical Systems" })
    .setTimestamp();

  await canal.send({ embeds: [embed] });
  await interaction.reply({
    content: `✅ $alert enviado correctamente a ${canal}.`,
    ephemeral: true,
  });
}
