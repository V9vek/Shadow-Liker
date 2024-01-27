import { glob } from "glob";
import IHandler from "../interfaces/IHandler";
import CustomClient from "./CustomClient";
import path from "path";
import Event from "./Event";
import { ClientEvents } from "discord.js";
import Command from "./Command";
import SubCommand from "./SubCommand";

export default class Handler implements IHandler {
  client: CustomClient;

  constructor(client: CustomClient) {
    this.client = client;
  }

  // Handling Events
  loadEvents = async () => {
    const files = (await glob(`build/events/**/*.js`)).map((filepath) =>
      path.resolve(filepath)
    );

    files.map(async (file) => {
      const event: Event = new (await import(file)).default(this.client);
      // console.log("event: ", event.name);

      if (!event.name) {
        return (
          delete require.cache[require.resolve(file)] &&
          console.log(`${file.split("/").pop()} does not have a name`)
        );
      }

      const execute = (...args: any) => event.execute(...args);

      if (event.once)
        this.client.once(event.name as keyof ClientEvents, execute);
      else this.client.on(event.name as keyof ClientEvents, execute);

      return delete require.cache[require.resolve(file)];
    });
  };

  // Handling Commands
  loadCommands = async () => {
    const files = (await glob(`build/commands/**/*.js`)).map((filepath) =>
      path.resolve(filepath)
    );

    files.map(async (file) => {
      const command: Command | SubCommand = new (await import(file)).default(
        this.client
      );
      // console.log("file: ", file);
      // console.log("command: ", command.name);

      if (!command.name) {
        return (
          delete require.cache[require.resolve(file)] &&
          console.log(`${file.split("/").pop()} does not have a name`)
        );
      }

      if (file.split("/").pop()?.split(".")[2]) {
        return this.client.subCommands.set(command.name, command);
      }

      this.client.commands.set(command.name, command as Command);

      return delete require.cache[require.resolve(file)];
    });
  };
}
