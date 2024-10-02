import {
	ChannelType,
	PermissionFlagsBits,
	SlashCommandBuilder
} from "discord.js";
import { CommandObject } from "typings";

export = {
	data: new SlashCommandBuilder()
		.setName("config")
		.setDescription("Commands to configure the bot")
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addSubcommandGroup((subcommand) =>
			subcommand
				.setName("suggest")
				.setDescription("Edit the suggestion channel")
				.addSubcommand((s) =>
					s
						.setName("channel")
						.setDescription(
							"Set channel to post all new suggestions in"
						)
						.addChannelOption((o) =>
							o
								.addChannelTypes(ChannelType.GuildText)
								.setName("channel")
								.setDescription(
									"The channel you want suggestions to be posted in"
								)
						)
				)
				.addSubcommand((s) =>
					s
						.setName("threads")
						.setDescription(
							"Whether to use threads with suggestions"
						)
						.addBooleanOption((o) =>
							o
								.setName("threads")
								.setDescription(
									"Whether to use threads with suggestions"
								)
								.setRequired(true)
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("review")
				.setDescription("Edit the review channel")
				.addChannelOption((o) =>
					o
						.setName("channel")
						.setDescription(
							"The channel to post all new reviews in"
						)
				)
		),

	botPermissions: [],
	enabled: true,
	deleted: false
} as CommandObject;
