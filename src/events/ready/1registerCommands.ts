import { Client, REST, Routes } from "discord.js";
import fetchAllCmds from "../../utils/commands/fetchAllCmds";

export = async (client: Client) => {
	(async () => {
		const rest = new REST().setToken(process.env.BOT_TOKEN!);

		try {
			console.log(`Started refreshing application (/) commands`);
			let cmds = [];
			const commands = await fetchAllCmds();

			for (const cmd of commands) {
				const enabled = cmd.enabled;
				if (enabled) cmds.push(cmd.data.toJSON());
			}

			const data: any = await rest.put(
				Routes.applicationCommands(client.user!.id),
				{
					body: cmds
				}
			);

			console.log(
				`Successfully reloaded ${data.length} application (/) commands`
			);
		} catch (error) {
			// And of course, make sure you catch and log any errors!
			console.error(error);
		}
	})();
};
