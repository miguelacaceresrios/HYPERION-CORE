import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Elimina mensajes recientes en el canal actual.")
  .addIntegerOption(option =>
    option
      .setName("cantidad")
      .setDescription("Cuántos mensajes borrar (1-100)")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(ctx) {
  //
  // ctx puede ser:
  // - interaction (slash command)
  // - wrapper manual desde el listener de $clear en messageCreate
  //
  const isSlash = !!ctx.isChatInputCommand; // slash viene con isChatInputCommand()
  const channel = isSlash ? ctx.channel : ctx.channel; // igual en ambos casos
  const member = isSlash ? ctx.member : ctx.member ?? ctx.guild?.members?.cache?.get(ctx.user?.id || ctx.author?.id);
  const replyEphemeral = async msg => {
    if (isSlash) {
      return ctx.reply({ content: msg, ephemeral: true });
    } else {
      return ctx.reply(msg);
    }
  };

  // ------- seguridad: chequear permiso del que ejecuta --------
  // necesitamos que el usuario que pide el clear tenga ManageMessages
  if (
    !member ||
    !member.permissions ||
    !member.permissions.has(PermissionFlagsBits.ManageMessages)
  ) {
    return replyEphemeral("❌ No tienes permiso para usar $clear aquí.");
  }

  // ------- seguridad: chequear permiso del bot en el canal -----
  const botMember = ctx.guild?.members?.me;
  if (
    !botMember ||
    !botMember.permissions.has(PermissionFlagsBits.ManageMessages)
  ) {
    return replyEphemeral("❌ El bot no tiene permiso para borrar mensajes (Manage Messages).");
  }

  // ------- leer cantidad --------
  let cantidad;
  if (isSlash) {
    cantidad = ctx.options.getInteger("cantidad");
  } else {
    // prefijo: ctx.args ya lo vamos a inyectar desde index.js
    cantidad = parseInt(ctx.args?.[0], 10);
  }

  if (isNaN(cantidad)) {
    return replyEphemeral("⚠️ Debes indicar un número. Ej: `$clear 10`");
  }

  if (cantidad < 1 || cantidad > 100) {
    return replyEphemeral("⚠️ Solo puedo borrar entre 1 y 100 mensajes.");
  }

  // ------- ejecutar el borrado --------
  if (!channel?.bulkDelete) {
    return replyEphemeral("⚠️ No puedo limpiar este tipo de canal.");
  }

  try {
    const deleted = await channel.bulkDelete(cantidad, true);
    return replyEphemeral(
      `🧹 Se eliminaron ${deleted.size} mensajes en ${channel}.`
    );
  } catch (err) {
    console.error("Error en clear:", err);
    return replyEphemeral(
      "❌ No se pudieron borrar algunos mensajes (quizá son muy antiguos >14 días)."
    );
  }
}
