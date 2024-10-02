import { Client, Guild, REST, Routes } from "discord.js";
import { CommandObject } from "typings";

export = ({
	client,
	commands,
	guild
}: {
	client: Client;
	commands: CommandObject[];
	guild: Guild;
}) => {
	(async () => {
		let rest = new REST().setToken(process.env.BOT_TOKEN!);

		try {
			console.log(
				`Started refreshing application (/) commands for guild ${guild.id}.`
			);
			let cmds = [];

			for (const cmd of commands) {
				if (cmd.enabled) cmds.push(cmd.data.toJSON());
			}

			const data: any = await rest.put(
				Routes.applicationGuildCommands(client.user!.id, guild.id),
				{
					body: cmds
				}
			);

			console.log(
				`Successfully reloaded ${data.length} application (/) commands for guild ${guild.id}.`
			);
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
};
