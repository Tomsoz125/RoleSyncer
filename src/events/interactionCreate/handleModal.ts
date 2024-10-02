import { Client, Interaction } from "discord.js";
import getLocalModals from "../../utils/commands/getLocalModals";
import getPermissionEmbed from "../../utils/embeds/getPermissionEmbed";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";

export = async (client: Client, interaction: Interaction) => {
	if (!interaction.isModalSubmit()) return;

	const localModals = getLocalModals();
	const modalObject = localModals.find((m) => {
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
	if (!modalObject) return;

	if (modalObject.deferred) await interaction.deferReply({ ephemeral: true });

	try {
		if (modalObject.permissions?.length) {
			for (const permission of modalObject.permissions) {
				// @ts-ignore
				if (!interaction.member!.permissions.has(permission)) {
					if (interaction.replied || interaction.deferred) {
						await interaction.editReply(
							getPermissionEmbed(
								interaction,
								modalObject.data.name
							)
						);
					} else {
						const embed = getPermissionEmbed(
							interaction,
							modalObject.data.name
						);
						embed.ephemeral = true;
						await interaction.reply(embed);
					}
					break;
				}
			}
		}
		await modalObject.callback(
			client,
			interaction,
			modalObject.data.startsWith
				? interaction.customId.replace(modalObject.data.customId, "")
				: interaction.customId
		);
	} catch (e) {
		console.error(e);
		if (interaction.replied || interaction.deferred) {
			await interaction.editReply(
				getUnexpectedErrorEmbed(interaction, modalObject.data.name)
			);
		} else {
			await interaction.reply(
				getUnexpectedErrorEmbed(interaction, modalObject.data.name)
			);
		}

		return;
	}
};
