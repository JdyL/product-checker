import cheerio from "cheerio";
import { TYPES } from "./constants.js";
import UserAgent from 'user-agents';

const checkKeyword = ({ html, keyword, element, doesNotExist }) => {
  const $ = cheerio.load(html);
  const text = $(element, html).text().trim();
  return doesNotExist ? !text.includes(keyword) : text.includes(keyword);
};

const getUserAgent = (regex) => {
  const userAgent = new UserAgent(regex);
  return userAgent.toString();
}

const defaultUserAgent = {deviceCategory: 'desktop'};

export const data = [
  {
    name: "Amazon PS5",
    url: "https://www.amazon.com.au/PlayStation-5-Console/dp/B08HHV8945/",
    inStock: (html) => {
      const keyword = "Currently unavailable.";
      const element = "#availability";
      return checkKeyword({ html, keyword, element });
    },
    type: TYPES.WEBSCRAPER,
    userAgent: () => getUserAgent(defaultUserAgent)
  },
  {
    name: "Target PS5",
    origin: "https://www.target.com.au",
    url: "https://www.target.com.au/playstation-5",
    inStock: (html) => {
      const keyword =
        "Releasing soon. Please check this page for release timing updates.";
      const element = "p.u-cocogooseLight";
      return checkKeyword({ html, keyword, element });
    },
    type: TYPES.WEBSCRAPER,
    userAgent: () => getUserAgent(defaultUserAgent)
  },
  {
    name: "BigW PS5",
    origin: "https://www.bigw.com.au/",
    url: "https://www.bigw.com.au/product/playstation-5-console/p/124625/",
    inStock: (html) => {
      const keyword = "Coming Soon";
      const element = "div.ProductLabel";
      return checkKeyword({ html, keyword, element });
    },
    type: TYPES.WEBSCRAPER,
    userAgent: () => getUserAgent(defaultUserAgent)
  },
  // {
  //   name: "Amazon Test DualSense",
  //   url:
  //     "https://www.amazon.com.au/DualSense-Wireless-Controller-PlayStation-5/dp/B08H99BPJN/",
  //   unavailableKeyword: "Currently unavailable.",
  //   element: "#availability",
  //   type: TYPES.WEBSCRAPER,
  // },
];
