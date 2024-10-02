import {
	ColorResolvable,
	EmbedBuilder,
	Interaction,
	InteractionReplyOptions
} from "discord.js";
import { colours } from "../../../config.json";

export = (interaction: Interaction, name: string): InteractionReplyOptions => {
	const embed = new EmbedBuilder()
		.setAuthor({
			name: "Insufficient Permissions",
			iconURL: interaction.guild!.members.me!.displayAvatarURL()
		})
		.setDescription("You don't have permission to perform this operation.")
		.setColor(colours.error as ColorResolvable)
		.setTimestamp()
		.setFooter({
			// @ts-ignore
			text: `${interaction.member!.displayName} • ${name}`,
			iconURL: interaction.guild!.iconURL() as string
		});

	return { embeds: [embed], ephemeral: true };
};
