import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  
  const fetchStockPrice = async (symbol) => {
  console.log("Fetching:", symbol); // ✅ debug
  console.log("Using key:", import.meta.env.VITE_FINNHUB_API_KEY); // ✅ debug

  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${import.meta.env.VITE_FINNHUB_API_KEY}`
  );

  if (!res.ok) {
    console.error("Failed to fetch:", await res.text()); // ✅ show error response
    throw new Error("API fetch failed");
  }

  const data = await res.json();
  return {
    symbol,
    price: data.c,
    change: data.d,
    percent: data.dp,
  };
};


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

 useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await Promise.all([
        fetchStockPrice("AAPL"),
        fetchStockPrice("GOOGL"),
        fetchStockPrice("MSFT"),
      ]);
      setStocks(data);
    } catch (err) {
      console.error("Failed to load stock data:", err);
    }
  };
  fetchData();
}, []);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">📊 Live Stock Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-700 transition"
          >
            <h3 className="text-xl font-bold mb-2">{stock.symbol}</h3>
            <p
              className={`${
                stock.change >= 0 ? "text-green-400" : "text-red-400"
              } text-lg font-semibold`}
            >
              ₹{stock.price.toFixed(2)} ({stock.percent.toFixed(2)}%)
            </p>
          </div>
          
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
