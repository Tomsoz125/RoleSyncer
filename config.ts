import dotenv from "dotenv";
import cfg from "./config.json";

dotenv.config();

let { BOT_TOKEN, TYPE, GUILD_ID, DATABASE_URL, DEVELOPMENT_TOKEN } =
	process.env;

export const config = {
	BOT_TOKEN,
	TYPE,
	GUILD_ID,
	DATABASE_URL,
	DEVELOPMENT_TOKEN,
	sharding: cfg.sharding,
	colours: cfg.colours
};
