import {
	CacheType,
	Client,
	CommandInteraction,
	CommandInteractionOption,
	Interaction,
	PermissionFlagsBits,
	TextChannel
} from "discord.js";
import { config } from "../../../config";
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
					`Sorry, but you need the \`Administrator\` permission in this guild to cluster it!`
				)
			);
		}

		try {
			var currentCluster = await db.cluster.findUnique({
				where: { primaryGuild: interaction.guildId }
			});
		} catch (e) {
			return await interaction.editReply(
				getUnexpectedErrorEmbed(interaction as Interaction, name)
			);
		}

		if (currentCluster) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`Sorry, but this guild is already the primary guild in a cluster and each guild can only own one cluster! Try clustering from another guild!`
				)
			);
		}

		const otherGuildId = interaction.options.get("guild", true)
			.value as string;

		if (interaction.guildId === otherGuildId) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`You can't cluster to your own server...`
				)
			);
		}

		try {
			var otherGuild = await client.guilds.fetch(otherGuildId);
		} catch (e) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`Sorry, but I'm not in that guild! You can invite me by clicking [here](${config.invite}) if you have the \`Manage Server\` permission!`
				)
			);
		}

		if (!otherGuild) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`Sorry, but I'm not in that guild! You can invite me by clicking [here](${config.invite}) if you have the \`Manage Server\` permission!`
				)
			);
		}
		let otherGuildMember = await otherGuild.members.fetch(
			interaction.user.id
		);
		if (!otherGuildMember) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`Sorry, but you're not in that guild!`
				)
			);
		}
		if (
			!otherGuildMember.permissions.has(
				PermissionFlagsBits.Administrator,
				true
			)
		) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`Sorry, but you need the \`Administrator\` permission in that guild to cluster it!`
				)
			);
		}

		try {
			var currentClusters = await db.guildClusters.findMany({
				where: { guildId: interaction.guildId },
				include: { cluster: true }
			});
		} catch (e) {
			return await interaction.editReply(
				getUnexpectedErrorEmbed(interaction as Interaction, name)
			);
		}

		for (const c of currentClusters) {
			if (c.cluster.primaryGuild === otherGuildId) {
				return await interaction.editReply(
					getErrorEmbed(
						interaction as Interaction,
						name,
						`Sorry, but that guild is already the owner of a cluster with you in it!`
					)
				);
			}
		}
		let notifChannel: any = interaction.options.get("channel", false);
		if (notifChannel) notifChannel = notifChannel.channel as TextChannel;

		try {
			var cluster = await db.cluster.create({
				data: {
					name: interaction.options.get("name", true).value as string,
					primaryGuild: interaction.guildId,
					primaryGuildNotifChannel: notifChannel
						? notifChannel.id
						: undefined,
					shareBans: interaction.options.get("share_bans", false)
						? (interaction.options.get("share_bans", false)!
								.value as boolean)
						: false
				}
			});

			var guild = await db.guildClusters.create({
				data: {
					guildId: otherGuildId,
					clusterId: cluster.id
				}
			});
		} catch (e) {
			return await interaction.editReply(
				getUnexpectedErrorEmbed(interaction as Interaction, name)
			);
		}

		return await interaction.editReply(
			getSuccessEmbed(
				interaction as Interaction,
				name,
				`👍 This guild and guild \`${otherGuild.name}\` have been clustered, the cluster has the id \`${cluster.id}\``
			)
		);
	}
};
