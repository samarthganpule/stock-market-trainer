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
  const [watchlistPrices, setWatchlistPrices] = useState({});
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("searchHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  // Fetch live prices for watchlist
  useEffect(() => {
    if (watchlist.length === 0) return;

    const fetchWatchlistPrices = async () => {
      const prices = {};
      for (const symbol of watchlist) {
        try {
          const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${import.meta.env.VITE_FINNHUB_API_KEY}`
          );
          const data = await res.json();
          if (data.c && !isNaN(data.c)) {
            prices[symbol] = {
              price: data.c,
              change: data.d,
              percent: data.dp,
            };
          }
        } catch (err) {
          console.error(`Error fetching ${symbol}:`, err);
        }
      }
      setWatchlistPrices(prices);
    };

    fetchWatchlistPrices();
    const interval = setInterval(fetchWatchlistPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [watchlist]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSearchResult(null);
    setChartData(null);
    setIsSearching(true);

    try {
      const symbol = searchSymbol.toUpperCase();

      // 1. Current price
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${import.meta.env.VITE_FINNHUB_API_KEY}`);
      
      if (!res.ok) {
        if (res.status === 403) {
          setError("⚠️ API rate limit reached. Please try again in a few minutes.");
        } else {
          setError("❌ Failed to fetch stock data. Please try again.");
        }
        return;
      }
      
      const data = await res.json();

      if (!data.c || isNaN(data.c) || data.c === 0) {
        setError("❌ Invalid or unsupported stock symbol. Try symbols like AAPL, MSFT, GOOGL, TSLA.");
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

      if (candleData.s === "ok" && candleData.c && candleData.c.length > 0) {
        setChartData({
          labels: candleData.t.map(ts => new Date(ts * 1000).toLocaleDateString()),
          prices: candleData.c,
        });
      } else {
        // Fallback: Generate mock historical data based on current price
        console.log("⚠️ Using mock data for chart");
        const mockPrices = [];
        const mockLabels = [];
        const basePrice = data.c;
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          mockLabels.push(date.toLocaleDateString());
          
          // Generate realistic price variations (±2% from base)
          const variation = (Math.random() - 0.5) * 0.04 * basePrice;
          mockPrices.push(basePrice + variation);
        }
        
        setChartData({
          labels: mockLabels,
          prices: mockPrices,
        });
        
        setError("⚠️ Using simulated historical data (API limit reached)");
      }

    } catch (err) {
      console.error(err);
      setError("❌ Error fetching stock data.");
    } finally {
      setIsSearching(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up pt-8">
          {user && (
            <div className="mb-6">
              <p className="text-gray-300 text-lg mb-2">Welcome back,</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {user.email}
              </p>
            </div>
          )}
          <h2 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent gradient-animate drop-shadow-2xl">
            Stock Market Dashboard
          </h2>
          <p className="text-gray-200 text-xl md:text-2xl font-light">Search and track your favorite stocks in real-time</p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full text-green-300 text-sm font-semibold">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live Market Data
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300 text-sm font-semibold">
              <span className="text-base">🔥</span>
              Real-Time Updates
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-300 text-sm font-semibold">
              <span className="text-base">📊</span>
              Interactive Charts
            </span>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSearch} className="glass-strong p-8 rounded-3xl shadow-2xl hover-lift border-2 border-cyan-500/30">
            <div className="mb-4">
              <label className="block text-cyan-300 text-sm font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">🔍</span>
                Search Stock Symbol
              </label>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={searchSymbol}
                  onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
                  placeholder="Enter symbol (e.g., AAPL, TSLA, GOOGL)"
                  className="w-full p-5 bg-gradient-to-r from-gray-900/80 to-gray-800/80 text-white rounded-xl border-2 border-gray-600 focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/40 transition placeholder-gray-500 text-xl font-bold shadow-lg uppercase tracking-wider"
                  required
                  disabled={isSearching}
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition">
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 px-12 py-5 rounded-xl hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition font-bold text-xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105 duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-cyan-400/30"
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Searching...
                  </span>
                ) : (
                  <span>🔍 Search</span>
                )}
              </button>
            </div>
            <div className="mt-5 flex items-center gap-3 text-sm">
              <span className="text-2xl">💡</span>
              <span className="font-bold text-gray-300">Popular Stocks:</span>
              <div className="flex flex-wrap gap-2">
                {['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN', 'META', 'NVDA'].map((sym, idx) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setSearchSymbol(sym)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition transform hover:scale-110 duration-200 ${
                      idx % 3 === 0 ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-500/40 text-cyan-300' :
                      idx % 3 === 1 ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-500/40 hover:to-pink-500/40 border border-purple-500/40 text-purple-300' :
                      'bg-gradient-to-r from-orange-600/30 to-red-600/30 hover:from-orange-500/40 hover:to-red-500/40 border border-orange-500/40 text-orange-300'
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 animate-slide-up">
            <div className="glass border-2 border-red-500/50 text-red-200 px-6 py-4 rounded-xl backdrop-blur-xl flex items-center gap-3 shadow-lg">
              <span className="text-2xl">⚠️</span>
              <span className="flex-1">{error}</span>
            </div>
          </div>
        )}

        {/* Watchlist & Recent Searches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
          {/* Watchlist */}
          {watchlist.length > 0 && (
            <div className="glass-strong p-7 rounded-3xl shadow-2xl hover-lift animate-slide-up border-2 border-yellow-500/30" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-4xl animate-float">⭐</span>
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent gradient-animate">
                    Your Watchlist
                  </span>
                </h4>
                <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full">
                  {watchlist.length} stocks
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {watchlist.map((symbol, idx) => {
                  const priceData = watchlistPrices[symbol];
                  return (
                    <button
                      key={idx}
                      className="group relative bg-gradient-to-br from-yellow-600/30 via-orange-600/30 to-red-600/30 p-5 rounded-xl hover:from-yellow-500/40 hover:via-orange-500/40 hover:to-red-500/40 transition shadow-xl hover:shadow-orange-500/50 transform hover:scale-105 duration-200 border-2 border-yellow-400/40 text-left"
                      onClick={() => {
                        setSearchSymbol(symbol);
                        document.querySelector("form").requestSubmit();
                      }}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl font-bold text-white drop-shadow-lg">{symbol}</span>
                          {priceData ? (
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              priceData.change >= 0 
                                ? 'bg-green-500/30 text-green-300 border border-green-400/50' 
                                : 'bg-red-500/30 text-red-300 border border-red-400/50'
                            }`}>
                              {priceData.change >= 0 ? '↑' : '↓'} {Math.abs(priceData.percent).toFixed(2)}%
                            </span>
                          ) : (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                          )}
                        </div>
                        {priceData && (
                          <div className="text-2xl font-bold text-yellow-100 drop-shadow-lg">
                            ${priceData.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity"></div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div className="glass-strong p-7 rounded-3xl shadow-2xl hover-lift animate-slide-up border-2 border-cyan-500/20" style={{ animationDelay: '0.3s' }}>
              <h4 className="text-2xl font-bold mb-5 flex items-center gap-3">
                <span className="text-4xl">🕒</span>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent gradient-animate">
                  Recent Searches
                </span>
              </h4>
              <div className="flex flex-wrap gap-3">
                {searchHistory.map((symbol, idx) => (
                  <button
                    key={idx}
                    className="bg-gradient-to-br from-cyan-600/40 to-blue-600/40 hover:from-cyan-500/50 hover:to-blue-500/50 px-6 py-3 rounded-xl transition text-base font-bold border-2 border-cyan-500/40 hover:border-cyan-400/60 transform hover:scale-110 duration-200 shadow-lg hover:shadow-cyan-500/30"
                    onClick={() => {
                      setSearchSymbol(symbol);
                      document.querySelector("form").requestSubmit();
                    }}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stock Result Card */}
        {searchResult && (
          <div className="max-w-6xl mx-auto mb-10 animate-slide-up">
            <div className="glass-strong p-12 rounded-3xl shadow-2xl border-2 border-cyan-500/30 hover-lift relative overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/15 via-blue-600/15 via-purple-600/15 to-pink-600/15 opacity-70"></div>
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent gradient-animate drop-shadow-lg">
                      {searchResult.symbol}
                    </h3>
                    <span className="px-4 py-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 rounded-full text-base font-bold border-2 border-green-400/40 animate-pulse shadow-lg shadow-green-500/20">
                      ● Live
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-7xl md:text-8xl font-bold mb-3 bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent drop-shadow-2xl">
                      ${searchResult.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className={`inline-flex items-center gap-4 px-7 py-4 rounded-2xl text-2xl font-bold shadow-2xl ${
                    searchResult.change >= 0 
                      ? "bg-gradient-to-r from-green-600/30 to-emerald-600/30 text-green-300 border-2 border-green-400/50 shadow-green-500/30" 
                      : "bg-gradient-to-r from-red-600/30 to-rose-600/30 text-red-300 border-2 border-red-400/50 shadow-red-500/30"
                  }`}>
                    <span className="text-4xl">{searchResult.change >= 0 ? "📈" : "📉"}</span>
                    <span className="drop-shadow-lg">
                      {searchResult.change >= 0 ? "+" : ""}
                      {searchResult.change.toFixed(2)} ({searchResult.percent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
                
                {!watchlist.includes(searchResult.symbol) && (
                  <button
                    onClick={() => {
                      const updated = [searchResult.symbol, ...watchlist].slice(0, 10);
                      setWatchlist(updated);
                      localStorage.setItem("watchlist", JSON.stringify(updated));
                    }}
                    className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white px-10 py-5 rounded-2xl hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 transition font-bold text-xl shadow-2xl hover:shadow-orange-500/60 transform hover:scale-110 duration-200 flex items-center gap-3 animate-glow border-2 border-yellow-400/40"
                  >
                    <span className="text-3xl">⭐</span>
                    <span className="drop-shadow-lg">Add to Watchlist</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chart Section */}
        {chartData && (
          <div className="max-w-6xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <StockChart
              labels={chartData.labels}
              prices={chartData.prices}
              symbol={searchResult.symbol}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
