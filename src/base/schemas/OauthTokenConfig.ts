import { Schema, model } from "mongoose";

interface IOauthTokenConfig {
  userId: string;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiryDate: number;
}

export default model<IOauthTokenConfig>(
  "OauthTokens",
  new Schema<IOauthTokenConfig>(
    {
      userId: { type: String, required: true },
      accessToken: { type: String, required: true },
      refreshToken: { type: String, required: true },
      tokenType: { type: String, required: true },
      expiryDate: { type: Number, required: true },
    },
    { timestamps: true }
  )
);
