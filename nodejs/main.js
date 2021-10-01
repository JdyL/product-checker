const rp = require("request-promise");
const cheerio = require("cheerio");
// Product url
const url =
  "https://www.amazon.com.au/DualSense-Wireless-Controller-PlayStation-5/dp/B08H99BPJN/";
const unavailableKeyword = "Currently unavailable.";

rp(url)
  .then(function (html) {
    const $ = cheerio.load(html);
    const text = $("#availability", html).text().trim();
    if (text.includes(unavailableKeyword))
      return console.log("Still unavailable");
    return console.log("Available!");
  })
  .catch(function (err) {
    return console.log("Error:", err);
  });
