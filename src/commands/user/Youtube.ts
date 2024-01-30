import {
  ApplicationCommandOptionChannelTypesMixin,
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import Command from "../../base/classes/Command";
import CustomClient from "../../base/classes/CustomClient";
import Category from "../../base/enums/Category";

export default class Youtube extends Command {
  constructor(client: CustomClient) {
    super(client, {
      name: "youtube",
      description: "Configure youtube notifications",
      category: Category.User,
      default_member_permissions: PermissionFlagsBits.Administrator, // TODO: change permission for all users
      dm_permission: false,
      dev: false,
      cooldown: 3,
      options: [
        {
          name: "add",
          description: "Add the youtube channel to receive notifications",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "target-channel",
              description: "The channel you want notifications in",
              type: ApplicationCommandOptionType.Channel,
              required: true,
            },
            {
              name: "youtube-id",
              description: "The ID of the channel you would like to add",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
            {
              name: "custom-message",
              description:
                "Templates: {VIDEO_TITLE} {VIDEO_URL} {CHANNEL_NAME} {CHANNEL_URL}",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
        {
          name: "remove",
          description:
            "Remove the youtube channel to not receive notifications",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "target-channel",
              description: "The channel you want notifications removed from",
              type: ApplicationCommandOptionType.Channel,
              required: true,
            },
            {
              name: "youtube-id",
              description: "The ID of the channel you would like to remove",
              type: ApplicationCommandOptionType.String,
              required: true,
            },
          ],
        },
      ],
    });
  }
}
