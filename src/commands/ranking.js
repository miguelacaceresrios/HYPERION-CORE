import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import path from "path";
import url from "url";
import { readJSON } from "../utils/jsonHandler.js";

export const data = new SlashCommandBuilder()
  .setName("ranking")
  .setDescription("Muestra el ranking global de XP.");

export async function execute(interaction) {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const rankingPath = path.join(__dirname, "../data/ranking.json");
  const ranking = await readJSON(rankingPath);

  if (!ranking.length)
    return interaction.reply({ content: "No hay datos de ranking aún.", ephemeral: true });

  const top = ranking
    .sort((a, b) => b.xp_total - a.xp_total)
    .slice(0, 10)
    .map((r, i) => `${i + 1}. **${r.usuario}** — ${r.xp_total} XP`);

  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle("🏆 Ranking de Desarrolladores")
    .setDescription(top.join("\n"))
    .setFooter({ text: "Isometrical Systems — Arasaka Core" });

  await interaction.reply({ embeds: [embed] });
}
