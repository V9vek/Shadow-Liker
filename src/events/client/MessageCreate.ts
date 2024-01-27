import { Events, Message } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";

export default class MessageCreate extends Event {
  constructor(client: CustomClient) {
    super(client, {
      name: Events.MessageCreate,
      description: "Event fired when message is created by user",
      once: false,
    });
  }

  execute = (message: Message) => {
    // console.log(args);
    if (message.author.bot) return;
    if (message.content === "hello") {
      message.reply("yo! welcome to the server");
    }
  };
}
