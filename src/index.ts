import { Configuration, OpenAIApi } from "openai";
import qrcode from "qrcode-terminal";
import { Client, LocalAuth, Buttons } from "whatsapp-web.js";

const configuration = new Configuration({
  apiKey: secretIdOpenAi,
});

const openAiStart = new OpenAIApi(configuration);

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  console.log("server ready");
});

client.on("message", async (msg) => {
  if (msg.author) return;
  const text = msg.body.toLowerCase() || null;

  if (text == "tanya bot?") {
    console.log('masuk sini')
    client.sendMessage(
      msg.from,
      new Buttons("Pilih output pertanyaan kamu", [
        {
          id: '1',
          body: 'output text'
        }
      ], 'Hallo aku bot yamani pilih opsi pertanyaan mu?'),
    );
    msg.getContact().then((resp) => {
      client.sendMessage(msg.from, 'Halo ' + resp.shortName)
    });
  }

  if (text) {
    try {
      const response = await openAiStart.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.3,
        max_tokens: 3000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      msg.getContact().then((resp) => {
        console.log(resp.shortName);
      });
      console.log(msg.author);
      client.sendMessage( msg.from,String(response.data.choices[0].text))
    } catch (e) {
      // msg.reply("Lagi dalam perbaikan, coba pertanyaan lain");
    }
  }
});

client.initialize();
