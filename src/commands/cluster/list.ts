import {
	CacheType,
	Client,
	CommandInteraction,
	CommandInteractionOption,
	EmbedBuilder,
	Interaction,
	PermissionFlagsBits
} from "discord.js";
import { db } from "../../../db";
import getErrorEmbed from "../../utils/embeds/getErrorEmbed";
import getSuccessEmbed from "../../utils/embeds/getSuccessEmbed";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";
let name = "List Clusters";

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

		try {
			var ownedCluster = await db.cluster.findUnique({
				where: { primaryGuild: interaction.guildId }
			});
			var currentClusters = await db.guildClusters.findMany({
				where: {
					guildId: interaction.guildId
				},
				include: { cluster: true }
			});
		} catch (e) {
			return await interaction.editReply(
				getUnexpectedErrorEmbed(interaction as Interaction, name)
			);
		}

		const embed = getSuccessEmbed(
			interaction as Interaction,
			name,
			ownedCluster
				? `**${ownedCluster.name}:**\n**ID:** \`${
						ownedCluster.id
				  }\`\n**Share Bans:** \`${ownedCluster.shareBans}\`${
						ownedCluster.primaryGuildNotifChannel
							? `\n**Notification Channel:** <#${ownedCluster.primaryGuildNotifChannel}>`
							: ``
				  }\n**Cluster Owner:** \`This Guild\``
				: ``
		).embeds![0] as EmbedBuilder;
		const fields = [];
		for (const cluster of currentClusters) {
			const c = cluster.cluster;
			if (ownedCluster?.id === c.id) continue;
			const ownerGuild = await client.guilds.fetch(c.primaryGuild);
			fields.push({
				name: c.name + ":",
				value: `**ID:** \`${c.id}\`\n**Share Bans:** \`${
					c.shareBans
				}\`${
					cluster.notificationsChannel
						? `\n**Notification Channel:** <#${cluster.notificationsChannel}>`
						: ``
				}\n**Cluster Owner:** ${
					ownerGuild ? ownerGuild.name + " " : ""
				}(\`${c.primaryGuild}\`)`
			});
		}
		embed.addFields(fields);

		return await interaction.editReply({ embeds: [embed] });
	}
};
