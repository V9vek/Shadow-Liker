import CustomClient from "../base/classes/CustomClient";
import Parser from "rss-parser";
import YoutubeNotificationConfig from "../base/schemas/YoutubeNotificationConfig";
import { TextChannel } from "discord.js";

const parser = new Parser();

export default async function checkYoutubeForUploads(client: CustomClient) {
  try {
    const ytNotificationConfigs = await YoutubeNotificationConfig.find();

    for (const ytNotificationConfig of ytNotificationConfigs) {
      const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${ytNotificationConfig.ytChannelId}`;
      const feed = await parser
        .parseURL(YOUTUBE_RSS_URL)
        .catch((error) => null);

      if (!feed?.items.length) continue;

      const latestVideo = feed.items[0];
      const lastCheckedVideoId = ytNotificationConfig.lastCheckedVideoId;

      if (
        !lastCheckedVideoId ||
        (latestVideo.id !== ytNotificationConfig.lastCheckedVideoId &&
          new Date(latestVideo.pubDate!) > lastCheckedVideoId.publishDate)
      ) {
        const guild =
          client.guilds.cache.get(ytNotificationConfig.guildId) ||
          (await client.guilds.fetch(ytNotificationConfig.guildId));

        // if guild does not exist, maybe bot has been kicked or server might be deleted
        if (!guild) {
          await YoutubeNotificationConfig.findOneAndDelete({
            _id: ytNotificationConfig._id,
          });
          continue;
        }

        const notificationChannel =
          guild.channels.cache.get(
            ytNotificationConfig.notificationChannelId
          ) ||
          (await guild.channels.fetch(
            ytNotificationConfig.notificationChannelId
          ));

        // if channel does not exist
        if (!notificationChannel) {
          await YoutubeNotificationConfig.findOneAndDelete({
            _id: ytNotificationConfig._id,
          });
          continue;
        }

        ytNotificationConfig.lastCheckedVideoId = {
          id: latestVideo.id.replace("yt:video:", ""),
          publishDate: new Date(latestVideo.pubDate!),
        };

        await ytNotificationConfig.save();

        const customMessage =
          ytNotificationConfig.customMessage
            ?.replace("{VIDEO_URL}", latestVideo.link!)
            ?.replace("{VIDEO_TITLE}", latestVideo.title!)
            ?.replace("{CHANNEL_NAME}", feed.title!)
            ?.replace("{VIDEO_NAME}", latestVideo.title!) ||
          `New video upload by ${feed.title} ${latestVideo.link}`;

        const message = `Hey @everyone, **${feed.title}** posted new video 🎬\nGo check it out at ${latestVideo.link} `;

        (notificationChannel as TextChannel).send(message);
      }
    }
  } catch (error) {
    console.log(`Error in ${__filename}: \n`, error);
  }
}
