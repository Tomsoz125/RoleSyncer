import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CacheType,
	Client,
	CommandInteraction,
	CommandInteractionOption,
	Interaction,
	PermissionFlagsBits
} from "discord.js";
import { db } from "../../../db";
import getErrorEmbed from "../../utils/embeds/getErrorEmbed";
import getSuccessEmbed from "../../utils/embeds/getSuccessEmbed";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";
import getCommandLink from "../../utils/getCommandLink";
let name = "Leave Cluster";

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
					`Sorry, but you need the \`Administrator\` permission in this guild to configure clusters!`
				)
			);
		}

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
		let clusterId = interaction.options.get("cluster", true)
			.value as number;
		if (!currentCluster1 || currentCluster1.id !== clusterId) {
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
						`Sorry, but this guild is not the specified cluster`
					)
				);
			}
		}
		const c = currentCluster1 || currentCluster2!.cluster;

		if (ownsCluster) {
			const res = getSuccessEmbed(
				interaction as Interaction,
				name,
				"You own this cluster, this means that if you leave it the cluster will be permanently deleted! Are you sure you want to leave the cluster?\n-# You can always kick other guilds from it using " +
					(await getCommandLink({
						client,
						command: "/cluster kick",
						guild: interaction.guild
					})) +
					"!"
			);
			// @ts-ignore
			res.components = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("leave-cluster-confirm-" + c.id)
					.setLabel("Delete Cluster")
					.setStyle(ButtonStyle.Danger)
					.setEmoji("<:redcross:1292324577837322280>"),
				new ButtonBuilder()
					.setCustomId("cancel-leave-cluster")
					.setLabel("Back To Safety")
					.setStyle(ButtonStyle.Success)
					.setEmoji("<:greencheck:1292324879319826503>")
			);

			return await interaction.editReply(res);
		} else {
			const res = getSuccessEmbed(
				interaction as Interaction,
				name,
				"Are you sure you want to leave this cluster?\n-# If you leave you cannot rejoin unless readded by somebody with Administrator permissions in the cluster owner's server (`" +
					c.id +
					"`) and this server!"
			);
			// @ts-ignore
			res.components = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("leave-cluster-confirm-" + c.id)
					.setLabel("Leave Cluster")
					.setStyle(ButtonStyle.Danger)
					.setEmoji("<:redcross:1292324577837322280>"),
				new ButtonBuilder()
					.setCustomId("cancel-leave-cluster")
					.setLabel("Back To Safety")
					.setStyle(ButtonStyle.Success)
					.setEmoji("<:greencheck:1292324879319826503>")
			);

			return await interaction.editReply(res);
		}
	}
};
