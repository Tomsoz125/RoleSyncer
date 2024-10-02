import { ShardingManager } from "discord.js";
import path from "path";
import { config } from "../config";

const manager = new ShardingManager(path.join(__dirname, "bot.js"), {
	totalShards: config.sharding.totalShards,
	shardList: config.sharding.shardList,
	token: config.BOT_TOKEN
});

manager.on("shardCreate", (shard) => {
	console.log(`Launched shard #${shard.id}`);
});

manager.spawn();
