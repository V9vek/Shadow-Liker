import { Schema, model } from "mongoose";

interface ILastCheckedVideoId {
  id: string;
  publishDate: Date;
}

interface IYtNotificationConfig {
  guildId: string;
  notificationChannelId: string;
  ytChannelId: string;
  customMessage: string;
  lastChecked: Date;
  lastCheckedVideoId: ILastCheckedVideoId;
}

export default model<IYtNotificationConfig>(
  "YtNotifications",
  new Schema<IYtNotificationConfig>(
    {
      guildId: { type: String, required: false },
      notificationChannelId: { type: String, required: false },
      ytChannelId: { type: String, required: true },
      customMessage: { type: String, required: false },
      lastChecked: { type: Date, required: true },
      lastCheckedVideoId: {
        type: {
          id: { type: String, required: true },
          publishDate: { type: Date, required: true },
        },
        required: false,
      },
    },
    { timestamps: true }
  )
);
