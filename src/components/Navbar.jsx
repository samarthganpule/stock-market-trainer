import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-strong text-white px-6 py-4 shadow-2xl border-b-2 border-gray-700/50 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition group">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-200">📈</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent gradient-animate">
            MyStockTrainer
          </h1>
        </Link>
        
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className={`relative hover:text-blue-400 transition font-semibold text-lg group ${isActive('/') ? 'text-blue-400' : ''}`}
          >
            Home
            {isActive('/') && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></span>
            )}
          </Link>
          
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`relative hover:text-blue-400 transition font-semibold text-lg group ${isActive('/dashboard') ? 'text-blue-400' : ''}`}
              >
                Dashboard
                {isActive('/dashboard') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></span>
                )}
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-2.5 rounded-xl transition font-semibold shadow-lg hover:shadow-red-500/50 transform hover:scale-105 duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`relative hover:text-blue-400 transition font-semibold text-lg group ${isActive('/login') ? 'text-blue-400' : ''}`}
              >
                Login
                {isActive('/login') && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"></span>
                )}
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 px-6 py-2.5 rounded-xl transition font-semibold shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
