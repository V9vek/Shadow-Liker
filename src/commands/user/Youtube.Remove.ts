import {
  ChatInputCommandInteraction,
  CacheType,
  EmbedBuilder,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import SubCommand from "../../base/classes/SubCommand";
import YtNotificationConfig from "../../base/schemas/YoutubeNotificationConfig";

export default class YoutubeRemove extends SubCommand {
  constructor(client: CustomClient) {
    super(client, {
      name: "youtube.remove",
    });
  }

  execute = async (interaction: ChatInputCommandInteraction) => {
    const ytChannelId = interaction.options.getString("youtube-id");
    const notificationChannel =
      interaction.options.getChannel("target-channel");

    await interaction.deferReply({ ephemeral: true });

    try {
      let channel = await YtNotificationConfig.findOne({
        ytChannelId: ytChannelId,
        notificationChannelId: notificationChannel?.id,
      });

      if (!channel) {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `⚠️ You are trying to delete channel, that you have not added! Please try again!`
              ),
          ],
        });
      }

      await YtNotificationConfig.findOneAndDelete({ _id: channel._id }).catch(
        (error) => console.log(error)
      );

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ Turned off notification for that channel`),
        ],
      });
    } catch (error) {
      console.log(error);
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "❌ There was and error while removing the channel! Please try again!"
            ),
        ],
      });
    }
  };
}
