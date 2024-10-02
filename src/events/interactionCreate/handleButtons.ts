import { Client, Interaction } from "discord.js";
import getLocalButtons from "../../utils/commands/getLocalButtons";
import getPermissionEmbed from "../../utils/embeds/getPermissionEmbed";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";

export = async (client: Client, interaction: Interaction) => {
	if (!interaction.isButton()) return;

	const localButtons = getLocalButtons();
	const buttonObject = localButtons.find((m) => {
		if (m.data.startsWith) {
			if (interaction.customId.startsWith(m.data.customId)) {
				return true;
			} else {
				return false;
			}
		} else {
			if (interaction.customId === m.data.customId) {
				return true;
			} else {
				return false;
			}
		}
	});
	if (!buttonObject) return;

	if (buttonObject.deferred)
		await interaction.deferReply({ ephemeral: true });

	try {
		if (buttonObject.permissions?.length) {
			for (const permission of buttonObject.permissions) {
				// @ts-ignore
				if (!interaction.member!.permissions.has(permission)) {
					if (interaction.replied || interaction.deferred) {
						await interaction.editReply(
							getPermissionEmbed(
								interaction,
								buttonObject.data.name
							)
						);
					} else {
						const embed = getPermissionEmbed(
							interaction,
							buttonObject.data.name
						);
						embed.ephemeral = true;
						await interaction.reply(embed);
					}
					break;
				}
			}
		}
		await buttonObject.callback(
			client,
			interaction,
			buttonObject.data.startsWith
				? interaction.customId.replace(buttonObject.data.customId, "")
				: interaction.customId
		);
	} catch (e) {
		console.error(e);
		if (interaction.replied || interaction.deferred) {
			await interaction.editReply(
				getUnexpectedErrorEmbed(interaction, buttonObject.data.name)
			);
		} else {
			await interaction.reply(
				getUnexpectedErrorEmbed(interaction, buttonObject.data.name)
			);
		}

		return;
	}
};
