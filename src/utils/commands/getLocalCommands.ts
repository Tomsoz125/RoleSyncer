import { CommandObject } from "typings";

import fs from "fs";
import path from "path";

export = (exceptions: string[] = []): CommandObject[] => {
	const commands = [];
	const foldersPath = path.join(__dirname, "../../commands");
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		if (folder.endsWith(".ts") || folder.endsWith(".js")) {
			const filePath = path.join(foldersPath, folder);
			const command: CommandObject = require(filePath);
			if ("data" in command && "callback" in command) {
				command.data = command.data.setDMPermission(false);
				commands.push(command);
			} else {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "data" and "callback" property.`
				);
			}
			continue;
		}

		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

		if (
			!commandFiles.includes("index.ts") &&
			!commandFiles.includes("index.js")
		) {
			console.log(
				`[WARNING] The command at ${commandsPath} is missing a required index.ts file.`
			);
		} else {
			let command = require(commandsPath) as CommandObject;
			command.data = command.data.setDMPermission(false);
			commands.push(command);
		}
	}

	return commands;
};
