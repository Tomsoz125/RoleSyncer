import {
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
		),

	botPermissions: [],
	enabled: true,
	deleted: false
} as CommandObject;
