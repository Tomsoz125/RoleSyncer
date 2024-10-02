import path from "path";
import { ContextMenuObject } from "typings";
import getAllFiles from "../getAllFiles";

export = (): ContextMenuObject[] => {
	let localMenus = [];

	for (const menu of [
		...getAllFiles(path.join(__dirname, "../..", "contextmenus"))
	]) {
		localMenus.push(require(menu));
	}
	return localMenus;
};
