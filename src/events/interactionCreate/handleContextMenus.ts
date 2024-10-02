import { Client, Interaction } from "discord.js";
import getLocalContextMenus from "../../utils/commands/getLocalContextMenus";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";

export = async (client: Client, interaction: Interaction) => {
	if (!interaction.isContextMenuCommand()) return;
	if (!interaction.guild) return;

	const localMenus = getLocalContextMenus();

	try {
		const menuObject = localMenus.find(
			(m: any) => m.data.name === interaction.commandName
		);
		if (!menuObject) return;
		if (menuObject.deferred || menuObject.deferred === undefined)
			await interaction.deferReply({ ephemeral: true });

		await menuObject.callback(client, interaction);
	} catch (e) {
		console.error(e);

		if (interaction.replied || interaction.deferred) {
			await interaction.editReply(
				getUnexpectedErrorEmbed(interaction, interaction.commandName)
			);
		} else {
			const embed = getUnexpectedErrorEmbed(
				interaction,
				interaction.commandName
			);
			embed.ephemeral = true;
			await interaction.reply(embed);
		}

		return;
	}
};
