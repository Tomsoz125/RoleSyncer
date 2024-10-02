import path from "path";
import { SelectMenuObject } from "typings";
import getAllFiles from "../getAllFiles";

export = (
	type: "role" | "string" | "user" | "mentionable" | "channel"
): SelectMenuObject[] => {
	let localMenus = [];

	for (const menu of [
		...getAllFiles(path.join(__dirname, "../..", "selectmenus", type))
	]) {
		localMenus.push(require(menu));
	}
	return localMenus;
};
