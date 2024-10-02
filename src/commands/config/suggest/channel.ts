import {
	CacheType,
	ChannelType,
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
						`❌ The suggestion channel must be a normal text channel!`
					)
				);
			}
			const myPerms = channel
				.permissionsFor(await interaction.guild.members.fetchMe(), true)
				.serialize(true);
			if (
				!myPerms.SendMessages ||
				!myPerms.EmbedLinks ||
				!myPerms.ManageThreads ||
				!myPerms.CreatePublicThreads ||
				!myPerms.SendMessagesInThreads ||
				!myPerms.ManageMessages ||
				!myPerms.ViewChannel ||
				!myPerms.AddReactions ||
				!myPerms.UseExternalEmojis
			) {
				return await interaction.editReply(
					getErrorEmbed(
						interaction as Interaction,
						name,
						`❌ I don't have the correct permissions in <#${channel.id}>!\n**I Need:**\n* \`Add Reations\`\n* \`Use External Emojis\`\n* \`View Channel\`\n* \`Send Messages\`\n* \`Embed Links\`\n* \`Manage Threads\`\n* \`Manage Messages\`\n* \`Create Public Threads\`\n* \`Send Messages in Threads\``
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
						suggestionChannel: channelId
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
						suggestionChannel: channelId
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
					? `👍 Sucessfully set the suggestions channel to <#${channelId}>!`
					: `👍 Sucessfully cleared the suggestions channel!`
			)
		);
	}
};
