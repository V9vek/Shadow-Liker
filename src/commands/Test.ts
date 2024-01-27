import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";

export default class Test extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "test",
      description: "Test command",
      category: Category.Utilities,
      default_member_permissions: PermissionFlagsBits.UseApplicationCommands,
      dm_permission: true,
      cooldown: 3,
      options: {},
      dev: false,
    });
  }

  execute = (interaction: ChatInputCommandInteraction) => {
    interaction.reply({
      content: "Test command has been ran!",
      ephemeral: true,
    });
  };

  autoComplete = (interaction: AutocompleteInteraction<CacheType>) => {};
}
