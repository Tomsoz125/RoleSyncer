import { ButtonObject } from "typings";

const path = require("path");
const getAllFiles = require("../getAllFiles");

export = (): ButtonObject[] => {
	let localModals = [];

	for (const menu of [
		...getAllFiles(path.join(__dirname, "../../", "modals"))
	]) {
		localModals.push(require(menu));
	}
	return localModals;
};
