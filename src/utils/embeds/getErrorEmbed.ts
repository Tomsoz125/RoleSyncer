import {
	ColorResolvable,
	EmbedBuilder,
	Interaction,
	InteractionReplyOptions
} from "discord.js";
import { colours } from "../../../config.json";

export = (
	interaction: Interaction,
	name: string,
	message: string
): InteractionReplyOptions => {
	const embed = new EmbedBuilder()
		.setAuthor({
			name,
			iconURL: interaction.guild!.members.me!.displayAvatarURL()
		})
		.setDescription(message)
		.setColor(colours.error as ColorResolvable)
		.setTimestamp()
		.setFooter({
			// @ts-ignore
			text: `${interaction.member!.displayName} • ${name}`,
			iconURL: interaction.guild!.iconURL() as string
		});

	return { embeds: [embed], ephemeral: true };
};
