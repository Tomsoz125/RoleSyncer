import { Client } from "discord.js";

export = async (client: Client) => {
	let applicationCommands = await client.application?.commands;

	await applicationCommands!.fetch();

	return applicationCommands;
};
