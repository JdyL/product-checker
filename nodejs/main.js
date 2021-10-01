const pushModule = require("./push-notification");
const rp = require("request-promise");
const cheerio = require("cheerio");
// Product url
const data = [
  {
    name: "Amazon",
    url:
      "https://www.amazon.com.au/DualSense-Wireless-Controller-PlayStation-5/dp/B08H99BPJN/",
    unavailableKeyword: "Currently unavailable.",
    element: "#availability",
  },
];

data.forEach(async (value) => {
  await rp(value.url)
    .then(function (html) {
      const $ = cheerio.load(html);
      const text = $(value.element, html).text().trim();
      if (text.includes(value.unavailableKeyword))
        return console.log(`${value.name}: Still unavailable`);
      return console.log(`${value.name}: available!`);
    })
    .catch(function (err) {
      return console.log("Error:", err);
    });
  pushModule.pushNotification();
});
