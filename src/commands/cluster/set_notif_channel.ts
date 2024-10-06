import {
	CacheType,
	Client,
	CommandInteraction,
	CommandInteractionOption,
	Interaction,
	MessageCreateOptions,
	PermissionFlagsBits,
	TextChannel
} from "discord.js";
import { db } from "../../../db";
import getErrorEmbed from "../../utils/embeds/getErrorEmbed";
import getSuccessEmbed from "../../utils/embeds/getSuccessEmbed";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";
import getCommandLink from "../../utils/getCommandLink";
let name = "Set Notification Channel";

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

		if (
			!interaction.memberPermissions!.has(
				PermissionFlagsBits.Administrator,
				true
			)
		) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`Sorry, but you need the \`Administrator\` permission in this guild to configure it!`
				)
			);
		}

		let clusterId = interaction.options.get("cluster", true)
			.value as number;

		try {
			var currentCluster1 = await db.cluster.findUnique({
				where: { primaryGuild: interaction.guildId }
			});
		} catch (e) {
			return await interaction.editReply(
				getUnexpectedErrorEmbed(interaction as Interaction, name)
			);
		}
		let ownsCluster = true;
		if (!currentCluster1) {
			ownsCluster = false;
			try {
				var currentCluster2 = await db.guildClusters.findUnique({
					where: {
						guildId_clusterId: {
							clusterId,
							guildId: interaction.guildId
						}
					},
					include: { cluster: true }
				});
			} catch (e) {
				return await interaction.editReply(
					getUnexpectedErrorEmbed(interaction as Interaction, name)
				);
			}
			if (!currentCluster2) {
				return await interaction.editReply(
					getErrorEmbed(
						interaction as Interaction,
						name,
						`Sorry, but this guild is not in a cluster`
					)
				);
			}
		}

		const channel = interaction.options.get("channel", true)
			.channel as TextChannel;

		if (ownsCluster) {
			try {
				await db.cluster.update({
					where: {
						primaryGuild: interaction.guildId
					},
					data: { primaryGuildNotifChannel: channel.id }
				});
			} catch (e) {
				return await interaction.editReply(
					getUnexpectedErrorEmbed(interaction as Interaction, name)
				);
			}
		} else {
			try {
				await db.guildClusters.update({
					where: {
						guildId_clusterId: {
							clusterId,
							guildId: interaction.guildId
						}
					},
					data: { notificationsChannel: channel.id }
				});
			} catch (e) {
				return await interaction.editReply(
					getUnexpectedErrorEmbed(interaction as Interaction, name)
				);
			}
		}

		await channel.send(
			getSuccessEmbed(
				interaction as Interaction,
				name,
				"This channel has been configured to recieve updates about cluster merging! To change this run " +
					(await getCommandLink({
						client,
						command: "/cluster set-notif-channel",
						guild: interaction.guild
					}))
			) as MessageCreateOptions
		);

		return await interaction.editReply(
			getSuccessEmbed(
				interaction as Interaction,
				name,
				`👍 Successfully set the cluster notification channel to <#${channel.id}>!`
			)
		);
	}
};
