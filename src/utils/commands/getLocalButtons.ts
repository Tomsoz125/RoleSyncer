import { ButtonObject } from "typings";

import fs from "fs";
import path from "path";
import getAllFiles from "../getAllFiles";

export = (): ButtonObject[] => {
	const buttons = [];
	const foldersPath = path.join(__dirname, "../../buttons");
	const buttonFolders = fs.readdirSync(foldersPath);

	for (const folder of buttonFolders) {
		if (folder.endsWith(".ts") || folder.endsWith(".js")) {
			const filePath = path.join(foldersPath, folder);
			const button: ButtonObject = require(filePath);
			buttons.push(button);
			continue;
		}

		for (const btn of [
			...getAllFiles(path.join(__dirname, "../..", "buttons", folder))
		]) {
			buttons.push(require(btn));
		}
	}

	return buttons;
};
