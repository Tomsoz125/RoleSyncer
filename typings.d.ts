import { Guild, SlashCommandBuilder } from "discord.js";

export interface CommandOptionChoice {
	name: string;
	value: string;
}

export interface CommandOption {
	name: string;
	description: string;
	type: ApplicationCommandOptionType;
	choices?: CommandOptionChoice[] = [];
	required?: boolean = false;
}

export interface CommandSubCommand {
	name: string;
	description: string;
	type: ApplicationCommandOptionType;
	options?: CommandOption[] = [];
}

export interface CommandObject {
	data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
	botPermissions?: bigint[] = [];
	deleted?: boolean = false;
	deferred?: boolean = true;
	enabled?: boolean;
	callback?: (
		client: Client,
		interaction: CommandInteraction & { guild: Guild },
		...args
	) => unknown;
}

export interface SubcommandObject {
	deferred: boolean;
	callback: (
		client: Client,
		interaction: CommandInteraction & { guild: Guild },
		subcommand: CommandInteractionOption<CacheType>,
		...args
	) => unknown;
}

export interface ContextMenuObject {
	data: ContextMenuCommandBuilder;
	deferred?: boolean = true;
	botPermissions?: bigint[] = [];
	enabled?: boolean;
	callback: (
		client: Client,
		interaction: ContextMenuCommandInteraction
	) => unknown;
}

export interface APIResponse<T> {
	success: boolean;
	message: string;
	data?: T;
}

export interface ButtonData {
	startsWith?: boolean = true;
	customId: string;
	name: string;
}

export interface ButtonObject {
	data: ButtonData;
	permissions?: bigint[] = [];
	deferred?: boolean = true;
	enabled?: string | boolean;
	callback: (
		client: Client,
		interaction: ButtonInteraction,
		argument: string
	) => unknown;
}

export interface SelectMenuObject {
	data: SelectMenuData;
	permissions?: bigint[] = [];
	deferred?: boolean = true;
	enabled?: string | boolean;
	callback: (
		client: Client,
		interaction: ButtonInteraction,
		argument: string
	) => unknown;
}
export interface SelectMenuData {
	startsWith?: boolean = true;
	customId: string;
	name: string;
}

export interface MessageArgument {
	name: string;
	value: string;
}
