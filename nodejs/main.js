import { pushNotification } from "./push-notification.js";
import rp from "request-promise";
import cheerio from "cheerio";

const types = {
  webScaper: "web-scraper",
  rest: "rest",
};

const sendNotification = (value) => {
  pushNotification(value);
};

// Product url
const data = [
  {
    name: "Amazon PS5",
    url: "https://www.amazon.com.au/PlayStation-5-Console/dp/B08HHV8945/",
    unavailableKeyword: "Currently unavailable.",
    element: "#availability",
    type: "web-scraper",
  },
  {
    name: "Amazon Test DualSense",
    url:
      "https://www.amazon.com.au/DualSense-Wireless-Controller-PlayStation-5/dp/B08H99BPJN/",
    unavailableKeyword: "Currently unavailable.",
    element: "#availability",
    type: "web-scraper",
  },
];

const webScrape = ({ html, value }) => {
  const $ = cheerio.load(html);
  const text = $(value.element, html).text().trim();
  if (text.includes(value.unavailableKeyword))
    return console.log(`${value.name}: UNAVAILABLE!`);
  sendNotification(value);
  return console.log(`${value.name}: AVAILABLE!`);
};

const main = {
  [types.webScaper]: (props) => webScrape(props),
  [types.rest]: (html) => webScrape(html),
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
