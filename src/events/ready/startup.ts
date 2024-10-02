import { Client } from "discord.js";

export = (client: Client) => {
	console.log(`${client.user?.username} is done loading and is now online!`);
};
