import {
	CacheType,
	ChannelType,
	Client,
	CommandInteraction,
	CommandInteractionOption,
	Interaction
} from "discord.js";
import { db } from "../../../db";
import getErrorEmbed from "../../utils/embeds/getErrorEmbed";
import getSuccessEmbed from "../../utils/embeds/getSuccessEmbed";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";
let name = "Review Config";

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

		const channelOption = interaction.options.get("channel");
		if (channelOption && channelOption.channel) {
			const channel = await interaction.guild.channels.fetch(
				channelOption.channel.id
			);
			if (!channel) {
				return await interaction.editReply(
					getErrorEmbed(
						interaction as Interaction,
						name,
						`❌ I couldn't find the channel you mentioned!`
					)
				);
			}
			if (channel.type !== ChannelType.GuildText) {
				return await interaction.editReply(
					getErrorEmbed(
						interaction as Interaction,
						name,
						`❌ The review channel must be a normal text channel!`
					)
				);
			}
			const myPerms = channel
				.permissionsFor(await interaction.guild.members.fetchMe(), true)
				.serialize(true);
			if (
				!myPerms.SendMessages ||
				!myPerms.EmbedLinks ||
				!myPerms.ManageMessages ||
				!myPerms.ViewChannel ||
				!myPerms.UseExternalEmojis
			) {
				return await interaction.editReply(
					getErrorEmbed(
						interaction as Interaction,
						name,
						`❌ I don't have the correct permissions in <#${channel.id}>!\n**I Need:**\n* \`View Channel\`\n* \`Send Messages\`\n* \`Embed Links\`\n* \`Manage Messages\`\n* \`Use External Emojis\``
					)
				);
			}

			var channelId: any = channel.id;
		} else {
			var channelId: any = null;
		}

		if (!config) {
			try {
				await db.guildConfig.create({
					data: {
						id: interaction.guildId,
						reviewChannel: channelId
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
						reviewChannel: channelId
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
				channelId
					? `👍 Sucessfully set the reviews channel to <#${channelId}>!`
					: `👍 Sucessfully cleared the reviews channel!`
			)
		);
	}
};
