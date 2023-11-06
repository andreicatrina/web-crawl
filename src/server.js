// /server.js
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const cheerio = require("cheerio");

app.use(cors());
app.use(bodyParser.json());

app.post("/crawl", async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const results = [];

    $("p, div, a").each((index, element) => {
      const text = $(element).text();
      const phoneNumbers = extractPhoneNumbers(text);

      const emails = text.match(/\S+@\S+\.\S+/g);

      const extractPhoneNumbers = (text) => {
        const phoneNumbersRegex = /\b\d+\b/g;
        const matches = text.match(phoneNumbersRegex) || [];

        const cleanNumbers = matches.map(
          (number) => number.replace(/\D/g, "") // Remove non-digit characters
        );

        return cleanNumbers;
      };

      if (phoneNumbers || emails) {
        results.push({ phoneNumbers, emails });
      }
    });

    res.json({ success: true, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
