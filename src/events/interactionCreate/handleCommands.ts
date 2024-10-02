import {
	CacheType,
	Client,
	CommandInteractionOption,
	Interaction,
	PermissionsBitField
} from "discord.js";
import { SubcommandObject } from "typings";
import getLocalCommands from "../../utils/commands/getLocalCommands";
import getUnexpectedErrorEmbed from "../../utils/embeds/getUnexpectedErrorEmbed";
export = async (client: Client, interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const localCommands = getLocalCommands();

	try {
		const commandObject = localCommands.find(
			(cmd) => cmd.data.name === interaction.commandName
		);
		if (!commandObject) return;

		if (
			(commandObject.deferred || commandObject.deferred === undefined) &&
			commandObject.callback
		)
			await interaction.deferReply({ ephemeral: true });
		if (
			(!interaction.guild || !interaction.inCachedGuild()) &&
			interaction.user.id !== "724833136894279690"
		)
			return;

		if (commandObject.botPermissions?.length) {
			let missingPerms = [];
			for (const permission of commandObject.botPermissions) {
				const bot = interaction.guild!.members.me!;
				if (!bot.permissions.has(permission, true)) {
					missingPerms.push(
						...new PermissionsBitField(permission).toArray()
					);
				}
			}
			if (missingPerms.length > 0) {
				return await interaction.editReply({
					content: `Sorry, but I dont have the required permissions to perform this action! I need the permission${
						missingPerms.length > 1 ? "s" : ""
					} \`${missingPerms.join("`, `")}\` :(`
				});
			}
		}

		if (commandObject.callback) {
			await commandObject.callback(client, interaction);
		} else {
			const subcommand =
				interaction.options.data.length > 0
					? interaction.options.data[0]
					: undefined;
			if (!subcommand) {
				console.log(
					`[SEVERE] Command ${commandObject.data.name} does not have a callback, but has no subcommands!`
				);
				return;
			}
			let path = `../../commands/${interaction.commandName}`;

			let checking = true;
			let checkingCmd: CommandInteractionOption<CacheType> | undefined =
				subcommand;
			while (checking) {
				path += `/${checkingCmd.name}`;
				if (checkingCmd.type === 2) {
					checkingCmd =
						checkingCmd.options && checkingCmd.options?.length > 0
							? checkingCmd.options[0]
							: undefined;
					if (!checkingCmd) {
						console.log(
							`[SEVERE] Command ${commandObject.data.name} has a subcommand group with no subcommands in!`
						);
						return;
					}
				} else {
					checking = false;
				}
			}

			const subcommandFile = require(path) as SubcommandObject;
			if (
				(subcommandFile.deferred === true ||
					subcommandFile.deferred === undefined) &&
				!interaction.deferred
			) {
				await interaction.deferReply({ ephemeral: true });
			}
			subcommandFile.callback(client, interaction, checkingCmd);
		}
	} catch (e) {
		console.error(e);

		if (interaction.replied || interaction.deferred) {
			await interaction.editReply(
				getUnexpectedErrorEmbed(interaction, interaction.commandName)
			);
		} else {
			const embed = getUnexpectedErrorEmbed(
				interaction,
				interaction.commandName
			);
			embed.ephemeral = true;
			await interaction.reply(embed);
		}
		return;
	}
};
