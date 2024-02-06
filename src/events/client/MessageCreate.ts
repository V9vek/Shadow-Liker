import {
  EmbedBuilder,
  Events,
  Message,
  MessageReaction,
  TextChannel,
  User,
} from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import { google, Auth } from "googleapis";
import url from "url";
import express from "express";
import OauthTokenConfig from "../../base/schemas/OauthTokenConfig";
import axios from "axios";
import http from "http";
const app = express();

export default class MessageCreate extends Event {
  oauth2Client: Auth.OAuth2Client;
  authorizationUrl: string;
  server: http.Server;

  guildId: string;
  channelId: string;
  userId: string;
  videoId: string;

  constructor(client: CustomClient) {
    super(client, {
      name: Events.MessageCreate,
      description: "Event fired when message is created by user",
      once: false,
    });

    this.oauth2Client = new google.auth.OAuth2(
      client.config.clientId,
      client.config.clientSecret,
      client.config.redirectUri
    );

    this.authorizationUrl = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: client.config.scopes,
      include_granted_scopes: true,
    });

    this.server = app.listen();
    this.makeRoutes();

    this.guildId = client.config.devGuildId;
    this.channelId = "";
    this.userId = "";
    this.videoId = "";
  }

  likeVideoUsingYTDataApi = async (accessToken: string) => {
    await axios.post(
      `https://www.googleapis.com/youtube/v3/videos/rate?id=${this.videoId}&rating=like`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  };

  makeRoutes = () => {
    app.get("/authorize", async (req: any, res: any) => {
      const q = url.parse(req.url, true).query;

      if (q.error) {
        console.log(`Error authorizing with google oauth:\n ${q.error}`);
      } else {
        const { tokens } = await this.oauth2Client.getToken(q.code as any);
        res.send(
          "✅ Authorization Successful. You can now return to the Discord app"
        );
        // res.redirect(
        //   `discord://discord.com/channels/${this.guildId}/${this.channelId}`
        // );
        this.oauth2Client.setCredentials(tokens);

        // save token to database
        const oauthTokenConfig = new OauthTokenConfig({
          userId: this.userId,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          tokenType: tokens.token_type,
          expiryDate: tokens.expiry_date,
        });

        await oauthTokenConfig.save().catch((error) => {
          console.log(`Error saving token to database: ${error}`);
        });

        this.likeVideoUsingYTDataApi(tokens.access_token ?? "");
      }

      this.server.close(() => {
        console.log("Server closed");
      });
    });
  };

  execute = async (message: Message) => {
    if (
      message.author.bot &&
      message.content.includes(" https://www.youtube.com/watch")
    ) {
      await message.react("❤");

      const filter = (reaction: MessageReaction, user: User) => {
        return !user.bot && reaction.emoji.name === "❤";
      };

      const reactionCollector = message.createReactionCollector({
        filter: filter,
        dispose: true,
        // time: 15_000
      });

      reactionCollector.on("collect", async (reaction, user) => {
        this.channelId = message.channelId;
        this.userId = user.id;
        this.videoId = message.content
          .match(/(https?:\/\/[^\s]+)/g)![0]
          .split("=")[1];

        console.log(`${user.tag} reacted with ${reaction.emoji}`);

        const tokenExist = await OauthTokenConfig.exists({ userId: user.id });

        if (!tokenExist) {
          this.server = app.listen(5000, async () => {
            console.log("server is running at 5000");

            const channel =
              this.client.channels.cache.get(this.channelId) ||
              (await this.client.channels.fetch(this.channelId));

            await (channel as TextChannel).send({
              embeds: [
                new EmbedBuilder()
                  .setTitle(
                    "🔐 For the first and last time authorize with Youtube"
                  )
                  .setURL(this.authorizationUrl),
              ],
            });
          });
        } else {
          let oauthTokens = await OauthTokenConfig.findById({
            _id: tokenExist._id,
          });

          const expiryDate = new Date(oauthTokens!.expiryDate);
          const currentDate = new Date();

          if (expiryDate <= currentDate) {
            // generate new access token using refresh token
            this.oauth2Client.setCredentials({
              refresh_token: oauthTokens?.refreshToken,
            });
            const res = await this.oauth2Client.refreshAccessToken();
            oauthTokens = await OauthTokenConfig.findByIdAndUpdate(
              tokenExist._id,
              { accessToken: res.credentials.access_token },
              { new: true }
            );
          }

          this.likeVideoUsingYTDataApi(oauthTokens?.accessToken ?? "");
        }
      });

      reactionCollector.on("remove", (reaction, user) => {
        console.log(`${user.tag} removed the reaction ${reaction.emoji}`);
      });

      // "end" event will not fire because we are not ending this event after some time
      // maybe we can add time of 1 week or something to remove this
      reactionCollector.on("end", (collected, reason) => {
        console.log(
          `Collected ${collected.size}. Reaction collector ended: ${reason}`
        );
      });
    }
  };
}
