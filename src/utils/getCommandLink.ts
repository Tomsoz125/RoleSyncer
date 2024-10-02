import { Client, Guild } from "discord.js";

export = async ({
	client,
	command,
	guild,
	guildId
}: {
	client: Client;
	command: string;
	guild?: Guild;
	guildId?: string;
}) => {
	if (!guild && !guildId) return command;
	if (!guild && guildId) {
		guild = await client.guilds.fetch(guildId!);
	}
	if (!guild) return command;

	const commandName =
		command.split(" ").length > 0
			? command.split(" ")[0].slice(1)
			: command.slice(1);
	if (!client.application) return command;
	const commands = await client.application.commands.fetch();
	const cmds = commands.filter((cmd) => cmd.name === commandName);
	return cmds.size > 0 ? `<${command}:${cmds.at(0)!.id}>` : command;
};
