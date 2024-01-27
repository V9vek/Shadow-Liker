import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";

export default class DevOnly extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "dev",
      description: "Dev command",
      category: Category.Utilities,
      default_member_permissions: PermissionFlagsBits.Administrator,
      dm_permission: true,
      cooldown: 3,
      options: {},
      dev: true,
    });
  }

  execute = (interaction: ChatInputCommandInteraction) => {
    interaction.reply({
      content: "Dev command 👩🏻‍💻 has been ran!",
      ephemeral: true,
    });
  };

  autoComplete = (interaction: AutocompleteInteraction<CacheType>) => {};
}
