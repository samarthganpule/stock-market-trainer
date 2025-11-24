import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
 import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");



const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/dashboard"); // ✅ redirect
  } catch (error) {
    setMessage("❌ " + error.message);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-500/20 rounded-2xl mb-4 animate-float">
            <span className="text-5xl">👋</span>
          </div>
          <h2 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent gradient-animate drop-shadow-2xl">
            Welcome Back
          </h2>
          <p className="text-gray-300 text-xl font-light">Login to access your dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="glass-strong p-8 rounded-2xl shadow-2xl hover-lift">
          <div className="mb-6">
            <label className="block text-sm font-bold mb-3 text-gray-300 flex items-center gap-2">
              <span>📧</span> Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 bg-gray-800/50 text-white rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-bold mb-3 text-gray-300 flex items-center gap-2">
              <span>🔒</span> Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 bg-gray-800/50 text-white rounded-xl border-2 border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 py-4 rounded-xl font-bold text-lg transition shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 duration-200"
          >
            Login to Dashboard
          </button>
          
          {message && (
            <div className="mt-6 p-4 glass border-2 border-red-500/50 rounded-xl text-sm text-center flex items-center gap-3 animate-slide-up">
              <span className="text-xl">⚠️</span>
              <span className="flex-1 text-red-200">{message}</span>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-400 hover:text-blue-300 font-bold transition">
                Sign Up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
