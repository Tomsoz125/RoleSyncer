import fs from "fs";
import path from "path";

export = (directory: string, foldersOnly = false): string[] => {
	let fileNames = [];
	// Get all folders in directory
	const files = fs.readdirSync(directory, { withFileTypes: true });

	// Loop all folders in the folder
	for (const file of files) {
		const filePath = path.join(directory, file.name);

		// If we want folders only, return the folders, otherwise only get files.
		if (foldersOnly) {
			if (file.isDirectory()) fileNames.push(filePath);
		} else {
			if (file.isFile()) {
				fileNames.push(filePath);
			}
		}
	}

	return fileNames;
};
