import fs from "fs";
import { PermissionFlagsBits } from "discord.js";

export const data = {
  name: "sudo",
  description: "Comandos administrativos: $sudo clear, $sudo reload, etc.",
};

/**
 * Comando administrativo para Isometrical Systems
 * Gato - Arasaka Core
 */
export async function execute(ctx) {
  const isSlash = !!ctx.isChatInputCommand;
  const channel = ctx.channel;
  const args = ctx.args || [];
  const member =
    ctx.member ??
    ctx.guild?.members?.cache?.get(ctx.user?.id || ctx.author?.id);

  const reply = (msg) =>
    isSlash
      ? ctx.reply({ content: msg, ephemeral: true })
      : ctx.reply(msg);

  // -------- permisos --------
  const botOwner = process.env.OWNER_ID;
  const isOwner =
    member?.id === botOwner ||
    member?.permissions?.has(PermissionFlagsBits.Administrator);

  if (!isOwner) {
    return reply("🚫 No tienes permisos para usar `$sudo`.");
  }

  // -------- argumentos --------
  const sub = args[0]?.toLowerCase();
  if (!sub) {
    return reply(
      "⚙️ **Uso de sudo:**\n" +
      "`$sudo clear` — Limpia **todo** el canal (incluye mensajes del bot).\n" +
      "`$sudo reload` — Recarga los comandos sin reiniciar el bot.\n" +
      "`$sudo info` — Muestra información interna del sistema."
    );
  }

  // -------- $sudo clear --------
  if (sub === "clear") {
    if (!channel?.bulkDelete) {
      return reply("⚠️ No puedo limpiar este tipo de canal.");
    }

    reply("🧠 Iniciando limpieza completa del canal (modo sudo)...");

    let totalDeleted = 0;
    try {
      while (true) {
        const messages = await channel.messages.fetch({ limit: 100 });
        if (messages.size === 0) break;

        const deleted = await channel.bulkDelete(messages, true);
        totalDeleted += deleted.size;
        await new Promise((r) => setTimeout(r, 1500));
      }

      reply(`✅ Canal limpiado completamente. Se borraron ${totalDeleted} mensajes.`);
    } catch (err) {
      console.error("Error en $sudo clear:", err);
      reply("⚠️ Error durante la limpieza. Algunos mensajes pueden ser antiguos o protegidos.");
    }
    return;
  }

  // -------- $sudo reload --------
  if (sub === "reload") {
    try {
      const commandsPath = new URL("../commands/", import.meta.url);
      const files = await fs.promises.readdir(commandsPath);

      for (const file of files) {
        if (!file.endsWith(".js")) continue;

        const fullPath = new URL(`../commands/${file}`, import.meta.url).href;
        const module = await import(fullPath + `?update=${Date.now()}`); // fuerza recarga
        ctx.client.commands.set(module.data.name, module);
      }

      reply("🔁 Comandos recargados correctamente.");
    } catch (err) {
      console.error("Error en $sudo reload:", err);
      reply("⚠️ Error al recargar los comandos.");
    }
    return;
  }

  // -------- $sudo info --------
  if (sub === "info") {
    const uptime = Math.round(process.uptime() / 60);
    const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

    return reply(
      `🧩 **Arasaka Core Bot**\n` +
      `🕓 Uptime: ${uptime} min\n` +
      `💾 Memoria usada: ${mem} MB\n` +
      `⚙️ Node.js ${process.version}`
    );
  }

  // -------- comando desconocido --------
  reply(`❓ Comando no reconocido: \`${sub}\`. Usa \`$sudo\` para ver opciones.`);
}
