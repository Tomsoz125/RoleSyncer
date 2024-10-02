import { Client, Guild } from "discord.js";
import { db } from "../../../db";

export = async (client: Client, guild: Guild) => {
	let guildConfig;
	try {
		guildConfig = await db.guildClusters.deleteMany({
			where: { guildId: guild.id }
		});
	} catch (ignored) {}

	try {
		await db.cluster.delete({
			where: { primaryGuild: guild.id }
		});
	} catch (ignored) {}
};
