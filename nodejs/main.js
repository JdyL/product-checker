import rp from "request-promise";
import { data } from "./data.js";
import { TYPES } from "./constants.js";
import open from "open";

let found = false;

// const sendNotification = (value) => {
//   pushNotification(value);
// };

const webScrape = async ({ html, value }) => {
  if (value.inStock(html)) return console.log(`${value.name}: UNAVAILABLE!`);
  // sendNotification(value);
  found = true;
  await open(value.url);
  return console.log(`${value.name}: AVAILABLE!`);
};

const main = {
  [TYPES.WEBSCRAPER]: (props) => webScrape(props),
  [TYPES.REST]: (html) => webScrape(html),
};

const withOptions = (url, origin, userAgent) => {
  // console.log("Trying with UserAgent:", userAgent);
  return {
    url,
    headers: {
      "User-Agent":
        userAgent ||
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

const getRandomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const runScraper = async () => {
  await Promise.all(
    data.map(async (value) => {
      await rp(withOptions(value.url, value.origin, value.userAgent()))
        .then(function (html) {
          main[value.type]({ html, value });
        })
        .catch(function (err) {
          return console.log("Error:", err);
        });
    })
  );
  const nextInterval = getRandomNumber(15000, 30000);
  console.log(`Polling again in ${nextInterval}ms`);
  if (!found) return setTimeout(runScraper, nextInterval);
};

runScraper();
