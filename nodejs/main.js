import { pushNotification } from "./push-notification.js";
import rp from "request-promise";
import { data } from "./data.js";
import { TYPES } from "./constants.js";

const sendNotification = (value) => {
  pushNotification(value);
};

const webScrape = ({ html, value }) => {
  if (value.inStock(html)) return console.log(`${value.name}: UNAVAILABLE!`);
  sendNotification(value);
  return console.log(`${value.name}: AVAILABLE!`);
};

const main = {
  [TYPES.WEBSCRAPER]: (props) => webScrape(props),
  [TYPES.REST]: (html) => webScrape(html),
};

const withOptions = (url, origin) => {
  return {
    url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      origin: origin,
    },
    method: "GET",
    mode: "cors",
  };
};

data.forEach(async (value) => {
  await rp(withOptions(value.url, value.origin))
    .then(function (html) {
      main[value.type]({ html, value });
    })
    .catch(function (err) {
      return console.log("Error:", err);
    });
});
