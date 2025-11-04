import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Muestra el estado del bot.");

export async function execute(interaction) {
  const ping = Date.now() - interaction.createdTimestamp;
  await interaction.reply({
    content: `🛰️ $ping → Estado operativo.\nLatencia actual: **${ping}ms**.`,
    ephemeral: true,
  });
}
