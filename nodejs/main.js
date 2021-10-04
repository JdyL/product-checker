const pushModule = require("./push-notification");
const rp = require("request-promise");
const cheerio = require("cheerio");

const types = {
  webScaper: "web-scraper",
  rest: "rest",
};

const sendNotification = (value) => {
  pushModule.pushNotification(value);
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

data.forEach(async (value) => {
  await rp(value.url)
    .then(function (html) {
      main[value.type]({ html, value });
    })
    .catch(function (err) {
      return console.log("Error:", err);
    });
});
