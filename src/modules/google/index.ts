import axios from "axios";
import cheerio from "cheerio";
import meta from "./meta";

const Answer = async (ctx, params?) => {
  if (!params) return;
  ctx.telegram.sendChatAction(ctx.chat.id, "typing");

  const text = ctx.message.text;
  let answer = "Not found.";

  // remove snazzy if starts
  const q = text.replace(/^snazzy/, "");

  // get result from google
  await axios
    .get(`https://google.com/search?q=${q}&hl=en`, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        referer: "https://www.google.com/",
      },
    })
    .then(({ data }) => {
      const classes = ["kno-rdesc", "DjWnwf", "Z0LcW", "hgKElc", "vXQmIe", "UQt4rd"];

      const $ = cheerio.load(data);
      const calcAns = $("input[jsname='fPLMtf']");
      for (let _class of classes) {
        let text = $(`.${_class}`).text();
        if (text) {
          if (text.startsWith("Description")) {
            text = text.replace(/^Description/g, "");
          }
          answer = `<b>${text}</b>`;
          break;
        }
      }

      if (!answer) answer = String(calcAns.val());
    })
    .catch((err) => {
      answer = "Not found.";
    });

  ctx.reply(answer, {
    parse_mode: "HTML",
    reply_to_message_id: ctx.message.message_id,
  });
};

export default {
  handler: Answer,
  match: /^(snazzy|what's|what is|whats) (.*)/,
  ...meta,
};
