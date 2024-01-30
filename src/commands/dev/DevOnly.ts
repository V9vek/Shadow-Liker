import {
  AutocompleteInteraction,
  CacheType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";
import YtNotificationConfig from "../../base/schemas/YoutubeNotificationConfig";

export default class DevOnly extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "dev",
      description: "Dev command",
      category: Category.Developer,
      default_member_permissions: PermissionFlagsBits.Administrator,
      dm_permission: true,
      cooldown: 3,
      options: {},
      dev: true,
    });
  }

  execute = async (interaction: ChatInputCommandInteraction) => {
    try {
      //* uncomment this for dummy YT data to insert in database
      // if (
      //   !(await YtNotificationConfig.exists({
      //     channelName: "u123",
      //     channelId: "ch345",
      //     videoIds: ["vi123", "vi345"],
      //   }))
      // ) {
      //   await YtNotificationConfig.create({
      //     channelName: "u123",
      //     channelId: "ch345",
      //     videoIds: ["vi123", "vi345"],
      //   });
      // }
    } catch (error) {
      console.log(error);
    }

    interaction.reply({
      content: "Dev command 👩🏻‍💻 has been ran",
      ephemeral: true,
    });
  };

  autoComplete = (interaction: AutocompleteInteraction<CacheType>) => {};
}
