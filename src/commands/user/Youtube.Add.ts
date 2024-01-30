import {
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import Parser from "rss-parser";
import YtNotificationConfig from "../../base/schemas/YoutubeNotificationConfig";

export default class YoutubeAdd extends SubCommand {
  parser: Parser;

  constructor(client: CustomClient) {
    super(client, {
      name: "youtube.add",
    });
    this.parser = new Parser();
  }

  execute = async (interaction: ChatInputCommandInteraction) => {
    try {
      await interaction.deferReply({ ephemeral: true });

      const notificationChannel =
        interaction.options.getChannel("target-channel");
      const ytChannelId = interaction.options.getString("youtube-id");
      const customMessage = interaction.options.getString("custom-message");

      const duplicateExist = await YtNotificationConfig.exists({
        notificationChannelId: notificationChannel?.id,
        ytChannelId: ytChannelId,
      });

      if (duplicateExist) {
        return interaction.followUp(
          `This channel has already been added for the discord channel ${notificationChannel?.name}`
        );
      }

      const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${ytChannelId}`;
      const feed = await this.parser
        .parseURL(YOUTUBE_RSS_URL)
        .catch((error) => {
          interaction.followUp(
            `There was an error fetching the channel. Please check the youtube channel id ${ytChannelId}`
          );
        });

      if (!feed) return;

      const ytChannelName = feed.title;

      const ytNotificationConfig = new YtNotificationConfig({
        guildId: interaction.guildId,
        notificationChannelId: notificationChannel?.id,
        ytChannelId: ytChannelId,
        customMessage: customMessage,
        lastChecked: new Date(),
        lastCheckedVideoId: null,
      });

      if (feed.items.length) {
        const latestVideo = feed.items[0];
        // console.log(latestVideo);
        ytNotificationConfig.lastCheckedVideoId = {
          id: latestVideo.id.replace("yt:video:", ""),
          publishDate: new Date(latestVideo.pubDate!),
        };
      }

      await ytNotificationConfig.save().catch((error) => {
        console.log(error);
      });

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle(
              `✅ ${ytChannelName} having channel id ${ytChannelId} has been added`
            )
            .setDescription(
              `${notificationChannel} will now receive notifications for ${ytChannelName}, whenever there is a new upload`
            ),
        ],
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "❌ There was and error while adding the channel! Please try again!"
            ),
        ],
      });
    }
  };
}
