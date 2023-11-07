// Import necessary libraries
import React, { useState } from "react";
import axios from "axios";

function App() {
  // State for URL input and scraping result
  const [url, setUrl] = useState("");
  const [result, setResult] = useState({ emailAddresses: null });

  // Function to handle scraping
  const handleScrape = async () => {
    try {
      // Make a POST request to the backend with the entered URL
      const response = await axios.post("http://localhost:5000/scrape", { url });
      console.log("Response from Backend:", response.data);

      // Update state with the scraping result
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Render the UI
  return (
    <div>
      <h1>Email Extractor</h1>
      <label>
        Enter URL:
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      </label>
      <button onClick={handleScrape}>Scrape</button>
      <div>
        <h2>Email Addresses:</h2>
        <ul>
          {result.emailAddresses && result.emailAddresses.length > 0
            ? result.emailAddresses.map((email, index) => <li key={index}>{email}</li>)
            : "No email addresses found."}
        </ul>
      </div>
    </div>
  );
}

export default App;
