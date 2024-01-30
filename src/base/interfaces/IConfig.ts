export default interface IConfig {
  // global
  token: string;
  discordClientId: string;
  mongoUrl: string;

  // dev
  devToken: string;
  devDiscordClientId: string;
  devGuildId: string;
  developerUserIds: string[];
  devMongoUrl: string;
}
