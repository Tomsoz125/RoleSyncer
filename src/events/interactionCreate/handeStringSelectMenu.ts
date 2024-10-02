import { Client, Interaction } from "discord.js";
import getLocalSelectMenus from "../../utils/commands/getLocalSelectMenus";
import getPermissionEmbed from "../../utils/embeds/getPermissionEmbed";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";

export = async (client: Client, interaction: Interaction) => {
	if (!interaction.isStringSelectMenu() || !interaction.guild) return;

	const localSelectMenus = getLocalSelectMenus("string");
	const selectMenuObject = localSelectMenus.find((m) => {
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
	if (!selectMenuObject) return;

	if (selectMenuObject.deferred)
		await interaction.deferReply({ ephemeral: true });

	try {
		if (selectMenuObject.permissions?.length) {
			for (const permission of selectMenuObject.permissions) {
				// @ts-ignore
				if (!interaction.member!.permissions.has(permission)) {
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp(
							getPermissionEmbed(
								interaction,
								selectMenuObject.data.name
							)
						);
					} else {
						const embed = getPermissionEmbed(
							interaction,
							selectMenuObject.data.name
						);
						embed.ephemeral = true;
						await interaction.followUp(embed);
					}
					break;
				}
			}
		}
		await selectMenuObject.callback(
			client,
			interaction,
			selectMenuObject.data.startsWith
				? interaction.customId.replace(
						selectMenuObject.data.customId,
						""
				  )
				: interaction.customId
		);
	} catch (e) {
		console.error(e);
		await interaction.followUp(
			getUnexpectedErrorEmbed(interaction, selectMenuObject.data.name)
		);

		return;
	}
};
