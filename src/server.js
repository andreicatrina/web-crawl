// Import necessary libraries
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

// Create an Express app
const app = express();
const port = 5000;

// Use CORS middleware
app.use(cors());
app.use(express.json());

// Define the /scrape endpoint
app.post("/scrape", async (req, res) => {
  try {
    // Extract the URL from the request body
    const { url } = req.body;

    // Validate the URL
    if (!url) {
      throw new Error("URL is required.");
    }

    // Send a GET request to the provided URL
    const response = await axios.get(url);

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Extract emails from href attributes in <a> tags
    const emailAddressesFromLinks = [];
    $("a[href]").each((index, element) => {
      const href = $(element).attr("href");
      const emailMatch = href.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
      if (emailMatch) {
        emailAddressesFromLinks.push(emailMatch[0]);
      }
    });

    // Extract emails from text content in <p> and <div> tags
    const emailAddressesFromText = [];
    $("p, div").each((index, element) => {
      const textContent = $(element).text();
      const emailMatch = textContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
      if (emailMatch) {
        emailAddressesFromText.push(emailMatch[0]);
      }
    });

    // Combine the email addresses from all sources
    const allEmailAddresses = [...emailAddressesFromLinks, ...emailAddressesFromText];

    console.log("Email Addresses:", allEmailAddresses);

    // Send the extracted emails in the response
    res.json({ emailAddresses: allEmailAddresses });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
