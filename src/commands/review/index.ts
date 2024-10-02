import {
	ChannelType,
	Client,
	ColorResolvable,
	CommandInteraction,
	EmbedBuilder,
	Interaction,
	SlashCommandBuilder
} from "discord.js";
import { config } from "../../../config";
import { db } from "../../../db";
import { CommandObject } from "../../../typings";
import getErrorEmbed from "../../utils/embeds/getErrorEmbed";
import getSuccessEmbed from "../../utils/embeds/getSuccessEmbed";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";
import getCommandLink from "../../utils/getCommandLink";

const name = "Suggest";
export = {
	data: new SlashCommandBuilder()
		.setName("review")
		.setDescription("Creates a review for the server")
		.setDMPermission(true)
		.addNumberOption((o) =>
			o
				.setName("rating")
				.setDescription("How many stars would you give the server")
				.setMaxValue(5)
				.setMinValue(0)
				.setRequired(true)
		)
		.addStringOption((o) =>
			o
				.setName("comment")
				.setDescription("Why you have chosen your rating")
				.setRequired(true)
		),
	botPermissions: [],
	deferred: true,
	enabled: true,
	callback: async (client: Client, interaction: CommandInteraction) => {
		if (!interaction.guildId || !interaction.guild) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`❌ You must use this command in a server!`
				)
			);
		}

		try {
			var guildConfig = await db.guildConfig.findUnique({
				where: { id: interaction.guildId }
			});
		} catch (e) {
			return await interaction.editReply(
				getUnexpectedErrorEmbed(interaction as Interaction, name)
			);
		}

		if (!guildConfig) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`❌ This server is not configured! Run ${await getCommandLink(
						{
							client,
							command: "/config review",
							guild: interaction.guild
						}
					)} to set it up!`
				)
			);
		}

		if (!guildConfig.reviewChannel) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`❌ ${await getCommandLink({
						client,
						command: "/review",
						guild: interaction.guild
					})} is not configured on this server!\nRun ${await getCommandLink(
						{
							client,
							command: "/config review",
							guild: interaction.guild
						}
					)} to set it up!`
				)
			);
		}

		const channel = await interaction.guild.channels.fetch(
			guildConfig.reviewChannel
		);
		if (!channel || channel.type !== ChannelType.GuildText) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`❌ ${await getCommandLink({
						client,
						command: "/review",
						guild: interaction.guild
					})} is not properly configured on this server!\nRun ${await getCommandLink(
						{
							client,
							command: "/config review",
							guild: interaction.guild
						}
					)} to set it up!`
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

		const rating = interaction.options.get("rating", true).value as number;
		const comment = interaction.options.get("comment", true)
			.value as string;
		let ratingStr = ``;
		for (let i = 0; i < rating; i++) {
			ratingStr += `<:reviewstar:1290809258149023815>`;
		}
		for (let i = 0; i < 5 - rating; i++) {
			ratingStr += `<:reviewemptystar:1290809298376462376>`;
		}

		const embed = new EmbedBuilder()
			.setTitle("New Review")
			.setDescription(comment)
			.addFields({ name: "Rating", value: ratingStr })
			.setFooter({
				text: `Review by ${interaction.user.username}`,
				iconURL: interaction.user.displayAvatarURL()
			})
			.setThumbnail(interaction.guild.iconURL())
			.setColor(
				(rating <= 2
					? config.colours.review_bad
					: rating === 3
					? config.colours.review_mid
					: config.colours.review_good) as ColorResolvable
			);
		await channel.send({ embeds: [embed] });
		await interaction.editReply(
			getSuccessEmbed(
				interaction as Interaction,
				name,
				`Successfully posted your review to <#${channel.id}>!`
			)
		);
	}
} as CommandObject;
