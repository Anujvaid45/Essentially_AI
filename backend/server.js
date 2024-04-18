require('dotenv').config()
const express = require('express');
const fs = require('fs');
const cors = require('cors')
const axios = require('axios');
const app = express();

app.use(cors());

// Path to the stock data file
const stockDataFile = 'stock-data.json';

// Function to fetch stock data from Polygon API 
async function fetchStockData() {
    try {
      const response = await axios.get('https://api.polygon.io/v3/reference/tickers', {
        params: {
          market: 'stocks',
          active: true,
          limit: 20,
          apiKey: 'qKyzgS3pUa1Mc43AxVj7IcdRpiwJQhov',
        },
      });

      
      
      const stockData = response.data.results.map(stock => ({
        symbol: stock.ticker,
        refreshInterval: Math.floor(Math.random() * 5) + 1, // Random interval between 1-5 seconds
        price: Math.floor(Math.random() * (150 - 25 + 1)) + 25, //range is from 25 to 150
        name:stock.name,
      }));
      
      return stockData;
    } catch (error) {
      console.error('Error fetching stock data:', error.message);
      return [];
    }
  }
// Function to update stock prices
function updateStockPrices() {
  fs.readFile(stockDataFile, 'utf8', (err, data) => {
    if (err) throw err;

    const stockData = JSON.parse(data);

    stockData.forEach((stock, index) => {
      const interval = setInterval(() => {
        // Update stock price with a random value
        const randomChange = Math.floor(Math.random() * (10 - (-10) + 1)) + (-10); // Range is from -10 to +10
    stock.price = Math.max(0, stock.price + randomChange); // Ensures stock.price never goes below 0

        // Write updated stock data to file
        fs.writeFile(stockDataFile, JSON.stringify(stockData,null,2), (err) => {
          if (err) throw err;
        //   console.log(`Updated price for ${stock.symbol}`);
        });
      }, stock.refreshInterval * 1000);
    });
  });
}

// Fetch initial stock data and start updating prices
fetchStockData().then(stockData => {
    fs.writeFile(stockDataFile, JSON.stringify(stockData), (err) => {
      if (err) throw err;
      updateStockPrices();
    });
  });

// API route to fetch stock prices
app.get('/api/stocks', (req, res) => {
  // Read the stock data file asynchronously
  fs.readFile(stockDataFile, 'utf8', (err, data) => {
    if (err) {
      // Handle read error by sending an error response to the client
      console.error('Error reading stock data file:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    try {
      // Parse the data as JSON and send it in the response
      const stockData = JSON.parse(data);
      res.json(stockData);
    } catch (parseError) {
      // Handle JSON parsing error by sending an error response to the client
      console.error('Error parsing stock data JSON:', parseError);
      res.status(500).json({ error: 'Error parsing stock data' });
    }
  });
});

app.listen(process.env.PORT,()=>{
  console.log(`connected to db&listening on port ${process.env.PORT}`)
})