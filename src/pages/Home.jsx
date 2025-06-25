import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to <span className="text-blue-400">MyStockTrainer</span></h1>
      <p className="text-gray-300 text-lg mb-8 max-w-xl">
        Monitor real-time stock data, simulate trades, and learn risk-free.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700 transition">
          Login
        </Link>
        <Link to="/signup" className="border border-white px-6 py-2 rounded hover:bg-white hover:text-gray-900 transition">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default Home;
