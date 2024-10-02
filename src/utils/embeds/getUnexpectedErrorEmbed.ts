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
			name: "Whoops! We weren't expecting that",
			iconURL: interaction.guild!.members.me!.displayAvatarURL()
		})
		.setDescription(
			"An unexpected error has occurred, if this persists please contact server administrators!"
		)
		.setColor(colours.error as ColorResolvable)
		.setTimestamp()
		.setFooter({
			// @ts-ignore
			text: `${interaction.member!.displayName} • ${name}`,
			iconURL: interaction.guild!.iconURL() as string
		});
	return { embeds: [embed], ephemeral: true };
};
