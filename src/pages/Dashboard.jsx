import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import StockChart from '../components/StockChart'

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [watchlist, setWatchlist] = useState(() => {
  const saved = localStorage.getItem("watchlist");
  return saved ? JSON.parse(saved) : [];
});

  const [searchHistory, setSearchHistory] = useState(() => {
  const saved = localStorage.getItem("searchHistory");
  return saved ? JSON.parse(saved) : [];
});
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSearchResult(null);
    setChartData(null);

    try {
      const symbol = searchSymbol.toUpperCase();

      // 1. Current price
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${import.meta.env.VITE_FINNHUB_API_KEY}`);
      const data = await res.json();

     if (!data.c || isNaN(data.c)) {
  setError("❌ Invalid or unsupported stock symbol.");
  return;
}


      setSearchResult({
        symbol,
        price: data.c,
        change: data.d,
        percent: data.dp,
      });
      // Save to localStorage history
setSearchHistory(prev => {
  const updated = [symbol, ...prev.filter(s => s !== symbol)].slice(0, 5);
  localStorage.setItem("searchHistory", JSON.stringify(updated));
  return updated;
});


      // 2. Historical data
   const today = Math.floor(Date.now() / 1000);
const weekAgo = today - 7 * 24 * 60 * 60;

const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${weekAgo}&to=${today}&token=${import.meta.env.VITE_FINNHUB_API_KEY}`;
console.log("📈 Chart API:", url);

const candleRes = await fetch(url);
const candleData = await candleRes.json();
console.log("Candle response:", candleData);

if (candleData.s !== "ok") {
  setError("❌ Could not fetch chart data.");
  return;
}


      setChartData({
        labels: candleData.t.map(ts => new Date(ts * 1000).toLocaleDateString()),
        prices: candleData.c,
      });

    } catch (err) {
      console.error(err);
      setError("❌ Error fetching stock data.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">🔍 Search Stock Price</h2>

      <form onSubmit={handleSearch} className="flex flex-col items-center mb-8">
        <input
          type="text"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          placeholder="Enter Stock Symbol (e.g., INFY, AAPL)"
          className="w-full max-w-md p-3 text-black rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
      {searchHistory.length > 0 && (
  <div className="max-w-md mx-auto mb-6">
    <h4 className="text-lg font-semibold mb-2">Recent Searches:</h4>
    <div className="flex flex-wrap gap-2">
      {searchHistory.map((symbol, idx) => (
        <button
          key={idx}
          className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition text-sm"
          onClick={() => {
            setSearchSymbol(symbol);
            document.querySelector("form").requestSubmit(); // trigger form
          }}
        >
          {symbol}
        </button>
      ))}
    </div>
  </div>
)}
{searchResult && (
  <div className="max-w-md mx-auto bg-gray-800 p-6 rounded shadow mb-4">
    <h3 className="text-xl font-bold mb-2">{searchResult.symbol}</h3>
    <p className={`text-lg font-semibold ${searchResult.change >= 0 ? "text-green-400" : "text-red-400"}`}>
      ₹{searchResult.price.toFixed(2)} ({searchResult.percent.toFixed(2)}%)
    </p>
    {!watchlist.includes(searchResult.symbol) && (
      <button
        onClick={() => {
          const updated = [searchResult.symbol, ...watchlist].slice(0, 10);
          setWatchlist(updated);
          localStorage.setItem("watchlist", JSON.stringify(updated));
        }}
        className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400"
      >
        ⭐ Add to Watchlist
      </button>
    )}
  </div>
)}
{watchlist.length > 0 && (
  <div className="max-w-md mx-auto mb-6">
    <h4 className="text-lg font-semibold mb-2">📌 Your Watchlist:</h4>
    <div className="flex flex-wrap gap-2">
      {watchlist.map((symbol, idx) => (
        <button
          key={idx}
          className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition text-sm"
          onClick={() => {
            setSearchSymbol(symbol);
            document.querySelector("form").requestSubmit(); // trigger search
          }}
        >
          {symbol}
        </button>
      ))}
    </div>
  </div>
)}



      {error && <p className="text-red-400 text-center font-semibold mb-4">{error}</p>}

      {searchResult && (
        <div className="max-w-md mx-auto bg-gray-800 p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-2">{searchResult.symbol}</h3>
          <p className={`text-lg font-semibold ${searchResult.change >= 0 ? "text-green-400" : "text-red-400"}`}>
            ₹{searchResult.price.toFixed(2)} ({searchResult.percent.toFixed(2)}%)
          </p>
        </div>
      )}

      {chartData && (
        <div className="mt-8">
          <StockChart
            labels={chartData.labels}
            prices={chartData.prices}
            symbol={searchResult.symbol}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
