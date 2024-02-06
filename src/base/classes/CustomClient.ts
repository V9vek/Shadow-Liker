import { Client, Collection, GatewayIntentBits } from "discord.js";
import ICustomClient from "../interfaces/ICustomClient";
import IConfig from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import { connect } from "mongoose";

export default class CustomClient extends Client implements ICustomClient {
  config: IConfig;
  handler: Handler;
  commands: Collection<string, Command>;
  subCommands: Collection<string, SubCommand>;
  cooldowns: Collection<string, Collection<string, number>>;
  developmentMode: boolean;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
      ],
    });
    this.config = require(`../../../data/config.json`);
    this.handler = new Handler(this);
    this.commands = new Collection();
    this.subCommands = new Collection();
    this.cooldowns = new Collection();
    this.developmentMode = process.argv.slice(2).includes("--development");
  }

  init = () => {
    console.log(
      `Starting the bot in ${
        this.developmentMode ? "development" : "production"
      } mode`
    );

    this.loadHandlers();

    this.login(
      this.developmentMode ? this.config.devToken : this.config.token
    ).catch((error) => console.log(error));

    connect(
      this.developmentMode ? this.config.devMongoUrl : this.config.mongoUrl
    )
      .then(() => console.log("✅Connected to MongoDB."))
      .catch((error) => console.log(error));
  };

  loadHandlers = () => {
    this.handler.loadEvents();
    this.handler.loadCommands();
  };
}
