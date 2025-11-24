import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 via-purple-950 to-pink-950 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-[500px] h-[500px] bg-cyan-500/25 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-500/25 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center relative z-10">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-in">
          <div className="mb-10">
            <div className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border-2 border-cyan-400/40 rounded-full text-cyan-300 text-base font-bold mb-8 animate-slide-up shadow-xl shadow-cyan-500/20 animate-glow">
              🚀 Start Your Trading Journey Today
            </div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-bold mb-10 leading-tight animate-slide-up drop-shadow-2xl" style={{ animationDelay: '0.1s' }}>
            Welcome to <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent gradient-animate">
              MyStockTrainer
            </span>
          </h1>
          
          <p className="text-gray-300 text-2xl md:text-3xl mb-6 max-w-3xl mx-auto font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Monitor real-time stock data, simulate trades, and learn risk-free.
          </p>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Your personal platform to master the stock market without risking real money.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-24 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Link 
            to="/login" 
            className="group relative bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 px-12 py-6 rounded-2xl hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 transition font-bold text-2xl shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 duration-200 border-2 border-cyan-400/30 animate-glow"
          >
            <span className="relative z-10 drop-shadow-lg">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-purple-300 rounded-2xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity"></div>
          </Link>
          
          <Link 
            to="/signup" 
            className="group relative border-3 border-white/40 px-12 py-6 rounded-2xl hover:bg-gradient-to-r hover:from-white hover:to-cyan-100 hover:text-gray-900 transition font-bold text-2xl shadow-2xl backdrop-blur-sm transform hover:scale-110 duration-200 hover:border-transparent"
          >
            <span className="drop-shadow-lg">Sign Up</span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mt-16">
          <div className="glass-strong p-10 rounded-3xl border-2 border-cyan-500/40 hover:border-cyan-400/70 transition hover-lift animate-slide-up shadow-2xl shadow-cyan-500/10" style={{ animationDelay: '0.5s' }}>
            <div className="text-7xl mb-6 animate-float">📊</div>
            <h3 className="text-3xl font-bold mb-5 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent gradient-animate">
              Real-Time Data
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Access live stock prices and market data from major exchanges worldwide.
            </p>
          </div>
          
          <div className="glass-strong p-10 rounded-3xl border-2 border-purple-500/40 hover:border-purple-400/70 transition hover-lift animate-slide-up shadow-2xl shadow-purple-500/10" style={{ animationDelay: '0.6s' }}>
            <div className="text-7xl mb-6 animate-float" style={{ animationDelay: '0.5s' }}>📈</div>
            <h3 className="text-3xl font-bold mb-5 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent gradient-animate">
              Track Performance
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Visualize stock trends with interactive charts and historical data.
            </p>
          </div>
          
          <div className="glass-strong p-10 rounded-3xl border-2 border-pink-500/40 hover:border-pink-400/70 transition hover-lift animate-slide-up shadow-2xl shadow-pink-500/10" style={{ animationDelay: '0.7s' }}>
            <div className="text-7xl mb-6 animate-float" style={{ animationDelay: '1s' }}>⭐</div>
            <h3 className="text-3xl font-bold mb-5 bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent gradient-animate">
              Build Watchlist
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Create and manage your personalized stock watchlist for quick access.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mt-24 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="text-center glass-strong p-8 rounded-3xl border-2 border-cyan-500/30 hover-lift shadow-xl shadow-cyan-500/10">
            <div className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3 gradient-animate drop-shadow-lg">
              100+
            </div>
            <div className="text-gray-300 text-xl font-semibold">Stock Symbols</div>
          </div>
          <div className="text-center glass-strong p-8 rounded-3xl border-2 border-purple-500/30 hover-lift shadow-xl shadow-purple-500/10">
            <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-3 gradient-animate drop-shadow-lg">
              Real-Time
            </div>
            <div className="text-gray-300 text-xl font-semibold">Market Data</div>
          </div>
          <div className="text-center glass-strong p-8 rounded-3xl border-2 border-pink-500/30 hover-lift shadow-xl shadow-pink-500/10">
            <div className="text-6xl font-bold bg-gradient-to-r from-pink-400 to-orange-500 bg-clip-text text-transparent mb-3 gradient-animate drop-shadow-lg">
              24/7
            </div>
            <div className="text-gray-300 text-xl font-semibold">Access</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
