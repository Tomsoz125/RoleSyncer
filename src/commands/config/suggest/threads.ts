import {
	CacheType,
	Client,
	CommandInteraction,
	CommandInteractionOption,
	Interaction
} from "discord.js";
import { db } from "../../../../db";
import getErrorEmbed from "../../../utils/embeds/getErrorEmbed";
import getSuccessEmbed from "../../../utils/embeds/getSuccessEmbed";
import getUnexpectedErrorEmbed from "../../../utils/embeds/getUnexpectedErrorEmbed";
let name = "Suggest Config";

export = {
	deferred: true,
	callback: async (
		client: Client,
		interaction: CommandInteraction,
		subcommand: CommandInteractionOption<CacheType>
	) => {
		if (!interaction.guildId || !interaction.guild) {
			if (!interaction.guildId || !interaction.guild) {
				return await interaction.editReply(
					getErrorEmbed(
						interaction as Interaction,
						name,
						`❌ You must use this command in a server!`
					)
				);
			}
		}

		try {
			var config = await db.guildConfig.findUnique({
				where: { id: interaction.guildId }
			});
		} catch (e) {
			return await interaction.editReply(
				getUnexpectedErrorEmbed(interaction as Interaction, name)
			);
		}

		let useThreads = interaction.options.get("threads", true)
			.value as boolean;

		if (!config) {
			try {
				await db.guildConfig.create({
					data: {
						id: interaction.guildId,
						threads: useThreads
					}
				});
			} catch (e) {
				return await interaction.editReply(
					getUnexpectedErrorEmbed(interaction as Interaction, name)
				);
			}
		} else {
			try {
				await db.guildConfig.update({
					where: {
						id: interaction.guildId
					},
					data: {
						threads: useThreads
					}
				});
			} catch (e) {
				return await interaction.editReply(
					getUnexpectedErrorEmbed(interaction as Interaction, name)
				);
			}
		}

		return await interaction.editReply(
			getSuccessEmbed(
				interaction as Interaction,
				name,
				`👍 Sucessfully ${
					useThreads ? "enabled" : "disabled"
				} the threads feature on suggestions!`
			)
		);
	}
};
