import { Client } from "discord.js";
import path from "path";
import getAllFiles from "../utils/getAllFiles";

export = (client: Client) => {
	const eventFolders = getAllFiles(
		path.join(__dirname, "..", "events"),
		true
	);

	for (const eventFolder of eventFolders) {
		const eventFiles = getAllFiles(eventFolder).filter(
			(f) => f.endsWith(".js") || f.endsWith(".ts")
		);
		eventFiles.sort((a: string, b: string) => {
			let an = 10;
			let bn = 10;
			if (/^\d/.test(a)) {
				an = parseInt(a.substring(0, 1));
			}
			if (/^\d/.test(b)) {
				bn = parseInt(b.substring(0, 1));
			}
			return an - bn;
		});

		const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

		client.on(eventName!, async (...args) => {
			for (const eventFile of eventFiles) {
				const eventFunction = require(eventFile);
				await eventFunction(client, ...args);
			}
		});
	}
};
