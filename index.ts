import { config } from "./config";

if (config.sharding.enabled) {
	require("./src/sharding");
} else {
	require("./src/bot");
}
