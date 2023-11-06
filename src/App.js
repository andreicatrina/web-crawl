// /App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);

  const handleCrawl = async () => {
    try {
      const response = await axios.post("http://localhost:3001/crawl", { url });
      setResults(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={handleCrawl}>Crawl</button>

      <div>
        <h2>Results</h2>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
