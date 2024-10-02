import { Client, Guild } from "discord.js";
import { db } from "../../../db";

export = async (client: Client, guild: Guild) => {
	let guildConfig;
	try {
		guildConfig = await db.guildConfig.findUnique({
			where: { id: guild.id }
		});
	} catch (ignored) {}

	if (!guildConfig) return;
	try {
		await db.guildConfig.delete({ where: { id: guild.id } });
	} catch (ignored) {}
};
