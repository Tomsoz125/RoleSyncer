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
		.setName("suggest")
		.setDescription("Creates a suggestion for the server")
		.setDMPermission(true)
		.addStringOption((o) =>
			o
				.setName("suggestion")
				.setDescription("The thing you want to suggest")
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
							command: "/config suggest channel",
							guild: interaction.guild
						}
					)} to set it up!`
				)
			);
		}

		if (!guildConfig.suggestionChannel) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`❌ ${await getCommandLink({
						client,
						command: "/suggest",
						guild: interaction.guild
					})} is not configured on this server!\nRun ${await getCommandLink(
						{
							client,
							command: "/config suggest channel",
							guild: interaction.guild
						}
					)} to set it up!`
				)
			);
		}

		const channel = await interaction.guild.channels.fetch(
			guildConfig.suggestionChannel
		);
		if (!channel || channel.type !== ChannelType.GuildText) {
			return await interaction.editReply(
				getErrorEmbed(
					interaction as Interaction,
					name,
					`❌ ${await getCommandLink({
						client,
						command: "/suggest",
						guild: interaction.guild
					})} is not properly configured on this server!\nRun ${await getCommandLink(
						{
							client,
							command: "/config suggest channel",
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

		const suggestion = interaction.options.get("suggestion", true)
			.value as string;

		const embed = new EmbedBuilder()
			.setTitle("Suggestion - Vote Below")
			.setDescription(
				`**Suggestion: **\`${suggestion}\`\n**Suggested By:** <@${interaction.user.id}>`
			)
			.setFooter({
				text: `Suggested by ${interaction.user.username}`,
				iconURL: interaction.user.displayAvatarURL()
			})
			.setColor(config.colours.suggest as ColorResolvable);
		const msg = await channel.send({ embeds: [embed] });
		await msg.react("👍");
		await msg.react("👎");
		if (guildConfig.threads) {
			await msg.startThread({
				name: `Suggestion by ${interaction.user.username}`
			});
		}
		await interaction.editReply(
			getSuccessEmbed(
				interaction as Interaction,
				name,
				`Successfully posted your suggestion to <#${channel.id}>!`
			)
		);
	}
} as CommandObject;
