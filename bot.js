const ChatGPT = require("./utils/chatgpt.bot");
const Qr = require("qrcode");
const { Client, RemoteAuth } = require("whatsapp-web.js");
// Require database
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
// dotenv
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
// qr code
const qrcode = require("qrcode-terminal");

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
  console.log("Connected to mongodb database");
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000,
    }),
  });

  // remote session saved
  client.on("remote_session_saved", async () => {
    console.log("remote session saved");
  });

  // When the client emits a "qr" event, generate a QR code with the provided data.
  client.on("qr", async (qr) => {
    qrcode.generate(qr, { small: true });
  });

  // When the client is successfully authenticated, log a message to the console.
  client.on("authenticated", () => {
    console.log("Authenticated");
  });

  // When the client is ready to send and receive messages, log a message to the console.
  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("message", async (message) => {
    // If the message body is empty, send a reply requesting the user to type something.
    if (!message.body) {
      return message.reply("Please type something");
    }

    // If the message is not sent from a valid WhatsApp account, send a reply requesting the user to send the message from a valid WhatsApp account.
    if (!message.from || !message.from.includes("@c.us")) {
      return message.reply(
        "Please send the message from a valid WhatsApp account"
      );
    }

    message.reply("Please wait for reply...");

    // Call the ChatGPT function with the message body to generate a reply.
    const reply = await ChatGPT(message.body);

    // If ChatGPT returns null, send a reply requesting the user to try again later.
    if (!reply) {
      return message.reply("Please try again later");
    }

    // Send the generated reply to the user.
    try {
      await message.reply(reply);
    } catch (error) {
      console.error(`Error sending reply to ${message.from}: ${error}`);
      const errorMessage = `Oops! Something went wrong. Please try again later. Error: ${error}`;
      await client.sendMessage(message.from, errorMessage);
    }
  });

  await client.initialize();
  console.log("Successfully initialized");
});
