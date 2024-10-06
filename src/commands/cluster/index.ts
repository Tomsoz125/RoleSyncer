import {
	ChannelType,
	InteractionContextType,
	PermissionFlagsBits,
	SlashCommandBuilder
} from "discord.js";
import { CommandObject } from "typings";

export = {
	data: new SlashCommandBuilder()
		.setName("cluster")
		.setDescription("Commands to configure the bot's cluster")
		.setContexts(InteractionContextType.Guild)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("create")
				.setDescription("Creates a new cluster for the guild")
				.addStringOption((o) =>
					o
						.setName("name")
						.setDescription("The name of the cluster")
						.setRequired(true)
				)
				.addStringOption((o) =>
					o
						.setName("guild")
						.setDescription(
							"The ID of the other guild to add to the cluster! (YOU MUST HAVE ADMINISTRATOR IN THIS GUILD)"
						)
						.setRequired(true)
				)
				.addBooleanOption((o) =>
					o
						.setName("share_bans")
						.setDescription(
							"Whether to also share bans between guilds!"
						)
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("set-notif-channel")
				.setDescription(
					"Sets the channel that recieves cluster related notifications"
				)
				.addStringOption((o) =>
					o
						.setName("cluster")
						.setDescription("The id of the cluster (/clusters)")
						.setRequired(true)
				)
				.addChannelOption((o) =>
					o
						.setName("channel")
						.setDescription("The channel to send logs in")
						.setRequired(true)
						.addChannelTypes(ChannelType.GuildText)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("list")
				.setDescription("Lists all clusters that the guild is in")
		),

	botPermissions: [PermissionFlagsBits.Administrator],
	enabled: true,
	deleted: false
} as CommandObject;
