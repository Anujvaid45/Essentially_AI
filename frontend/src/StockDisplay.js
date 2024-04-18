import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockDisplay.css';

const StockDisplay = () => {
  const [stocks, setStocks] = useState([]);
  const [numStocksToDisplay, setNumStocksToDisplay] = useState('');

  useEffect(() => {
    // Function to fetch stock data from the backend
    const fetchStocks = async () => {
      try {
        const response = await axios.get('https://essentially-ai-backend.onrender.com/api/stocks');
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error.message);
      }
    };

    // Fetch initial stock data
    fetchStocks();

    // Short polling to fetch updated stock data every second
    const interval = setInterval(fetchStocks, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const displayedStocks =
    numStocksToDisplay === ''
      ? stocks
      : stocks.slice(0, parseInt(numStocksToDisplay));

  return (
    <div className="stock-display">
      <h1 className="stock-display__title">Stock Prices</h1>
      <form className="stock-display__form" onSubmit={handleSubmit}>
        <label htmlFor="numStocks">Number of stocks to display:</label>
        <input
          type="number"
          id="numStocks"
          value={numStocksToDisplay}
          onChange={(e)=>setNumStocksToDisplay(e.target.value)}
          min="1"
          className="stock-display__input"
        />
        <button type="submit" className="stock-display__button">
          Update
        </button>
      </form>
      <div className="stock-display__table-container">
        <table className="stock-display__table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Symbol</th>
              <th>Name</th>
              <th>Price</th>
              <th>Refresh Interval</th>
            </tr>
          </thead>
          <tbody>
            {displayedStocks.map((stock, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{stock.symbol}</td>
                <td>{stock.name}</td>
                <td>{stock.price}</td>
                <td>{stock.refreshInterval}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockDisplay;