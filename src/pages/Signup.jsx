import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";



function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

const handleSignup = async (e) => {
  e.preventDefault();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    navigate("/dashboard"); // ✅ redirect
  } catch (error) {
    setMessage("❌ " + error.message);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-pink-950 text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-500/20 rounded-2xl mb-4 animate-float">
            <span className="text-5xl">🚀</span>
          </div>
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent gradient-animate drop-shadow-2xl">
            Create Account
          </h2>
          <p className="text-gray-300 text-xl font-light">Start your stock trading journey today</p>
        </div>
        
        <form onSubmit={handleSignup} className="glass-strong p-8 rounded-2xl shadow-2xl hover-lift">
          <div className="mb-6">
            <label className="block text-sm font-bold mb-3 text-gray-300 flex items-center gap-2">
              <span>📧</span> Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 bg-gray-800/50 text-white rounded-xl border-2 border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-bold mb-3 text-gray-300 flex items-center gap-2">
              <span>🔒</span> Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full p-4 bg-gray-800/50 text-white rounded-xl border-2 border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
              <span>💡</span> Password must be at least 6 characters
            </p>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 py-4 rounded-xl font-bold text-lg transition shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 duration-200"
          >
            Create Account
          </button>
          
          {message && (
            <div className="mt-6 p-4 glass border-2 border-red-500/50 rounded-xl text-sm text-center flex items-center gap-3 animate-slide-up">
              <span className="text-xl">⚠️</span>
              <span className="flex-1 text-red-200">{message}</span>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-bold transition">
                Login
              </a>
            </p>
          </div>
        </form>

        {/* Features list */}
        <div className="mt-8 glass p-6 rounded-2xl">
          <p className="text-sm text-gray-400 mb-3 font-semibold">What you'll get:</p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Real-time stock data access
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Personal watchlist management
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Interactive price charts
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Signup;
